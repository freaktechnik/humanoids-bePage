<?php
    header('Content-Type: application/xml;charset=utf8');

    $sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>');
    $s = $sitemap->addChild('sitemap');
    $s->addChild('loc', 'https://humanoids.be/page_sitemap.xml');

    $blogsitemap = simplexml_load_file('https://humanoids.be/log/sitemap_index.xml');
    foreach($blogsitemap->children() as $sp) {
        if(empty($sp->lastmod))
            continue;

        $s = $sitemap->addChild('sitemap');
        foreach($sp->children() as $c) {
            $s->addChild($c->getName(), (string)$c);
        }
    }

    echo $sitemap->asXML();
?>
