const products={zl02_pro:{product:"zl02_pro",productNumber:"6765264630220609"},lenovok3:{product:"lenovok3",productNumber:"322451873835489"}},urls={zl02_pro:["https://fb.me/255fhz14v","https://fb.me/qwqwqw"],lenovok3:["https://fb.me/3kaSU9EUG","https://fb.me/300fhz14v","https://fb.me/sdsdsd"]},cities=["La Paz","El Alto","Cochabamba","Santa Cruz","Oruro","Potosi","Sucre","Tarija","Provincia"],cityList=t=>createInteractiveMessage(t,"list","Ciudades","Departamentos de Bolivia",cities.map(((t,e)=>({id:(e+1).toString().padStart(2,"0"),title:t})))),createInteractiveMessage=(t,e,i,s,o)=>({messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"interactive",interactive:{type:e,body:{text:"*Selecciona la ciudad de donde escribes:*"},action:{button:i,sections:[{title:s,rows:o}]}}});module.exports={products:products,cities:cities,cityList:cityList,urls:urls};