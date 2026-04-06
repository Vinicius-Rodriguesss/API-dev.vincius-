import getNews from "./getNews.js";

const resultado = await getNews();
console.log(resultado);

export default getNews;


// npx tsx service/News/index.ts
