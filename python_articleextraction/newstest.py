# -*- coding: utf-8 -*-
"""
Created on Sun Oct 29 17:19:51 2017

@author: Holzleim
"""
import csv
import feedparser
from newspaper import Article
import string
import random

with open('FeedsTest.CSV', 'r') as csvfile:
    feeds = csv.reader(csvfile, delimiter='|', quotechar='"')
    next(feeds)
    a = 0
    print("ANZAHL: " + str(a))
    for feed in feeds:
        d = feedparser.parse(feed[0])
        for entrie in d.entries:
            #check link
            url = entrie.link
            #check date
            
            #check if in db
            
            #parse
            
            #title and 
            try:
                article = Article(url, language='de', keep_article_html=True)
                article.download()
                article.parse()
            
                filename = feed[3] + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
                file = open("html/"+ filename + ".html","w")
                
                article.article_html = "<meta property='baseurl' content='"+ feed[4] +"'>" + article.article_html
                article.article_html = "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>" + article.article_html
                article.article_html = "<link href='https://fonts.googleapis.com/css?family=Slabo+27px' rel='stylesheet'>" + article.article_html
                article.article_html = "<img src='" + article.top_image +"' width='100%' >" + article.article_html
                article.article_html = "<h1 class='realTitle'>" + entrie.title + "</h1>" + article.article_html
                article.article_html = article.article_html + "<link type='text/css' rel='stylesheet' href='../css/renderStyles.css'/>"
                article.article_html = article.article_html + "<script src='../js/renderScript.js'></script>"
                article.article_html = "<div class='pr0news pr0-text text-orange " + feed[3] + "'>" + article.article_html + "</div>"
            
                file.write(article.article_html)
                file.close()
            
                if article.title != entrie.title:
                    print(str(len(article.title)) + " || " + str(len(entrie.title)))
                else:
                    print("true")
                a = a + 1
            except:
                print("Oops!")
    print("ANZAHL: " + str(a))
                
            