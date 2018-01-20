require("request");
const cheerio = require("cheerio");
const request = require("request-promise-native");

class Article {    
    constructor(url){
        if (!url)
            throw "must provide url";
        
        this.paragraphs = [];
        
        this.ready = this.request(url);
    }
    
    async request(url){
        this.parse(await request(url));
    }
    
    parse(data){
        const $ = this.$ = cheerio.load(data);
        $(".content__article-body > p").each((i, p) => {
            // `p` is a cheerio node
            this.paragraphs.push(Article.getTextFromNode(p));
        });
    }
    
    then(...args){
        return this.ready.then(...args);
    }
    
    // node is a cheerio node
    static getTextFromNode(node){
        var out = "";
        if (node.type === "tag"){
            for (child of node.children){
                out += Article.getTextFromNode(child);
            }
        } else if (node.type === "text"){
            out += node.data;
        } else {
            console.warn(node);
        }

        return out;
    }
}


class Dictionary {
    constructor(articles){
        this.words = {};
        
        if (!articles)
            throw "must provide articles";
            
        this.ready = this.request_articles(articles);
    }
    
    // articles = [urls]
    async request_articles(articles){
        await Promise.all(articles.map((url) => {
            this.add_article(new Article(url))
        }));
    }
    
    // article: instanceof Article
    async add_article(article){
        await article;
        for (const p of article.paragraphs){
            this.add_string(p);
        }
    }
    
    then(...args){
        return this.ready.then(...args);
    }
    
    add_string(str){
        const words = str.split(" ");
        for (var word of words){
            // toLowerCase (for congruency) and remove punctuation 
            word = Dictionary.simplifyWord(word);
            
            if (!word) continue; // don't need empty strings
                
            // already defined?
            if (this.words[word]){
                // increment the count
                this.words[word].count++
            } else {
                // define the account
                this.words[word] = {
                    word: word,
                    count: 1
                };
            }
        }
    }
    
    sort(){
        this.sorted = Object.values(this.words).sort((a, b) => {
            if (a.count > b.count)
                return -1
            if (a.count == b.count)
                return 0;
            if (a.count < b.count)
                return 1;
        });
    }
    
    static simplifyWord(word){
        return word.toLowerCase().replace(/\W+/g, "");
    }
}

const articles = [
    "https://www.theguardian.com/us-news/2017/dec/03/michael-flynn-plea-agreement-mueller-russia", 
    "https://www.theguardian.com/lifeandstyle/2017/dec/03/my-daughter-needs-plastic-surgery-how-can-i-tell-her-mariella-frostrup", 
    "https://www.theguardian.com/us-news/2017/dec/03/why-did-roy-moore-escape-to-australia-clues-remain-in-the-outback-wilderness", 
    "https://www.theguardian.com/politics/2017/dec/02/theresa-may-crisis-mass-walkout-social-policy-alan-milburn", 
    "https://www.theguardian.com/world/2017/dec/03/risk-of-war-with-north-korea-grows-every-day-says-trumps-security-adviser",
    "https://www.theguardian.com/environment/2017/jul/03/elephant-20-natures-internet-information-architecture"
];

/*
dictionary["hello"] = {
    word: "hello",
    count: <int>, // frequency, across all articles
}
*/
const dictionary = {};

async function run(){
    const requests = [];
    for (article of articles){
        requests.push(request(article).then(data => {
            cheerio.load(data)(".content__article-body > p")
                .each((i, v) => addWordsToDictionary(getText(v)));
        }));
    }
    
    await Promise.all(requests);
    console.log(filterDictionary());
}


var sorted = [];

function getText(node){
    var out = "";
    if (node.type === "tag"){
        for (child of node.children){
            out += getText(child);
        }
    } else if (node.type === "text"){
        out += node.data;
    } else {
        console.warn(node);
    }
    
    return out;
}

function simplifyWord(word){
    return word.toLowerCase().replace(/\W+/g, "");
}

function addWordsToDictionary(text){

}




function filterDictionary(){
    const sorted = sortDictionary();
    
    return sorted.filter(entry => excludes.indexOf(entry.word) === -1);
}