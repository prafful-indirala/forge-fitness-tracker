const allowedImage=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

function reply(response,status,payload){
 response.status(status).setHeader("Content-Type","application/json; charset=utf-8");
 response.setHeader("Cache-Control","no-store");
 return response.end(JSON.stringify(payload));
}

export default async function handler(request,response){
 if(request.method!=="POST")return reply(response,405,{error:"Method not allowed."});
 const token=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
 if(!token)return reply(response,503,{error:"Ask Forge is waiting for its AI connection. The workout tracker and timer still work normally."});

 const body=request.body||{},question=typeof body.question==="string"?body.question.trim().slice(0,500):"",image=typeof body.image==="string"?body.image:null,exercise=body.exercise&&typeof body.exercise==="object"?body.exercise:{};
 if(!question&&!image)return reply(response,400,{error:"Ask a question or attach a machine photo first."});
 if(image&&(!allowedImage.test(image)||image.length>4_500_000))return reply(response,400,{error:"That photo format or size is not supported. Try a smaller JPG, PNG or WebP."});

 const exerciseContext={
  day:String(exercise.day||"").slice(0,80),name:String(exercise.name||"").slice(0,120),sets:Number(exercise.sets)||0,reps:String(exercise.reps||"").slice(0,30),rest:Number(exercise.rest)||0,note:String(exercise.note||"").slice(0,160)
 };
 const system=`You are Forge, a concise in-gym exercise assistant. Answer only the user's current exercise question using the supplied workout context. Help identify gym equipment from images, compare movement patterns, suggest safe substitutions, and explain seat/handle/range setup. Never claim certainty about a machine from an unclear image; tell the user to check its label and movement path. Do not diagnose pain or injury. If the user reports sharp pain, dizziness, numbness, or instability, tell them to stop and seek qualified help. Preserve the programmed muscle target, sets, rep range and rest where reasonable. Keep the answer under 120 words. Return only valid JSON with keys: answer (string), replacement (string or empty string), caution (string or empty string). replacement must be a short exercise name only when you recommend a specific swap that can be logged today.`;
 const text=`Workout context: ${JSON.stringify(exerciseContext)}\nQuestion: ${question||"Is the pictured machine a suitable substitute for this exercise?"}`;
 const content=[{type:"text",text}];if(image)content.push({type:"image_url",image_url:{url:image}});

 try{
  const gatewayResponse=await fetch("https://ai-gateway.vercel.sh/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","x-vercel-ai-gateway-user":"forge-single-user","x-vercel-ai-gateway-tags":"feature:ask-forge"},body:JSON.stringify({model:process.env.FORGE_AI_MODEL||"openai/gpt-5.4",messages:[{role:"system",content:system},{role:"user",content}],response_format:{type:"json_object"},max_tokens:350,temperature:.2})});
  const gatewayPayload=await gatewayResponse.json().catch(()=>({}));
  if(!gatewayResponse.ok){console.error("Ask Forge gateway error",gatewayResponse.status,gatewayPayload?.error?.message||"Unknown gateway error");const status=gatewayResponse.status===429?429:502;return reply(response,status,{error:status===429?"Forge is getting a lot of questions. Try again in a moment.":"Forge couldn’t check that right now. Your question is still here—please try again."})}
  const raw=gatewayPayload?.choices?.[0]?.message?.content;if(!raw)throw new Error("Empty AI response");
  const parsed=JSON.parse(raw);return reply(response,200,{answer:String(parsed.answer||"").slice(0,1200),replacement:String(parsed.replacement||"").slice(0,100),caution:String(parsed.caution||"").slice(0,300)});
 }catch(error){console.error("Ask Forge handler error",error);return reply(response,500,{error:"Forge couldn’t check that right now. Your question is still here—please try again."})}
}
