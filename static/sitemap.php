<?php
/*
humanoids bePage
Copyright (C) 2016 Martin Giger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
    header('Content-Type: application/xml;charset=utf8');

    $sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>');
    $s = $sitemap->addChild('sitemap');
    $s->addChild('loc', 'https://humanoids.be/sitemap_index.xml');
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
