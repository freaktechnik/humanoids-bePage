"use strict";
// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { default: Mastodon } = require("megalodon");
const fetch = require("node-fetch");
const Twitter = require("twitter");
const twitterText = require("twitter-text"),

    getToots = (userId, baseUrl) => {
        const mastoAPI = new Mastodon(
            undefined, // We don't need a token for what we're doing
            baseUrl
        );
        return mastoAPI.get(`/accounts/${userId}/statuses`);
    },

    getTwitterBearerToken = async (key, secret) => {
        const creds = Buffer.from(`${encodeURIComponent(key)}:${encodeURIComponent(secret)}`).toString('base64'),
            body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        const resp = await fetch('https://api.twitter.com/oauth2/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`
            },
            body
        });
        if(resp.ok) {
            const json = await resp.json();
            return json.access_token;
        }
    },

    getTweets = async (userId) => {
        const token = await getTwitterBearerToken(process.env.TWITTER_KEY, process.env.TWITTER_SECRET),
            twitter = new Twitter({
                "consumer_key": process.env.TWITTER_KEY,
                "consumer_secret": process.env.TWITTER_SECRET,
                "bearer_token": token
            });
        return twitter.get('statuses/user_timeline', {
            "user_id": userId,
            "include_rts": false,
            count: 20,
            "tweet_mode": "extended"
        });
    };

module.exports = function(api) {
    api.loadSource(async (store) => {
        const archive = store.addContentType({
            typeName: "Archive"
        });
        archive.addSchemaField('version', ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
            resolve(node) {
                return node.version;
            }
        }));
        const archiveItems = require("./src/data/archive.json");
        for(const archiveItem of archiveItems) {
            archive.addNode({
                id: archiveItem.path,
                title: archiveItem.title,
                slug: archiveItem.path,
                path: `/archive/${archiveItem.path}`,
                excerpt: archiveItem.name,
                version: archiveItem.version
            });
        }

        const events = store.addContentType({
                typeName: "Event"
            }),
            talks = store.addContentType({
                typeName: "Talk"
            });
        talks.addSchemaField('slides', ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            resolve(node) {
                return node.slides;
            }
        }));
        talks.addSchemaField('recording', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve(node) {
                return node.recording;
            }
        }));
        events.addSchemaField("url", ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            resolve(node) {
                return node.url;
            }
        }));
        talks.addReference("event", "Event");

        const eventItems = require("./src/data/events.json");
        for(const talk of eventItems) {
            const eventNode = events.addNode({
                title: talk.event.title,
                date: talk.event.date,
                url: talk.event.url
            });
            talks.addNode({
                title: talk.title,
                slides: talk.slides,
                recording: talk.recording,
                event: eventNode.id
            });
        }

        const projects = store.addContentType({
            typeName: "Project"
        });
        projects.addSchemaField('url', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve(node) {
                return node.url;
            }
        }));
        projects.addSchemaField('source', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve(node) {
                return node.source;
            }
        }));
        projects.addSchemaField('type', ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
                name: 'ProjectTypeEnum',
                values: {
                    CREATING: {
                        value: 'CREATING',
                        name: 'Creating',
                        description: 'Creating the project'
                    },
                    CONTRIBUTING: {
                        value: 'CONTRIBUTING',
                        name: 'Contributing',
                        description: 'Contributing to the project'
                    }
                }
            })),
            resolve(node) {
                return node.type.toUpperCase();
            }
        }));
        projects.addSchemaField('tag', ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
                name: 'ProjectTagEnum',
                values: {
                    'BROWSER_EXTENSION': {
                        value: 'BROWSER_EXTENSION',
                        name: 'Browser extension'
                    },
                    SERVICE: {
                        value: 'SERVICE',
                        name: 'Service'
                    },
                    LIBRARY: {
                        value: 'LIBRARY',
                        name: 'Library'
                    },
                    'TWITCH_EXTENSION': {
                        value: 'TWITCH_EXTENSION',
                        name: 'Twitch extension'
                    },
                    WEBSITE: {
                        value: 'WEBSITE',
                        name: 'Website'
                    },
                    CLI: {
                        value: 'CLI',
                        name: 'Command line applet'
                    }
                }
            })),
            resolve(node) {
                return node.tag.toUpperCase().replace('-', '_');
            }
        }));
        const projectItems = require("./src/data/projects.json");
        for(const project of projectItems) {
            projects.addNode({
                title: project.title,
                source: project.source,
                url: project.url,
                type: project.type,
                tag: project.tag
            });
        }

        const timeline = store.addContentType({
            typeName: 'TimelineEvent'
        });
        timeline.addSchemaField('end', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve(node) {
                return node.end;
            }
        }));
        timeline.addSchemaField('graduated', ({ graphql }) => ({
            type: graphql.GraphQLString,
            resolve(node) {
                return node.graduated;
            }
        }));
        timeline.addSchemaField('type', ({ graphql }) => ({
            type: new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
                name: 'TimelineType',
                values: {
                    EDUCATION: {
                        value: 'EDUCATION',
                        name: 'Education'
                    },
                    CIVIL_SERVICE: {
                        value: 'CIVIL_SERVICE',
                        name: 'Civil service'
                    },
                    WORK: {
                        value: 'WORK',
                        name: 'Work'
                    }
                }
            })),
            resolve(node) {
                return node.type.toUpperCase().replace('-', '_');
            }
        }));
        const timelineData = require("./src/data/timeline.json");
        for(const timelineEvent of timelineData) {
            timeline.addNode({
                title: timelineEvent.title,
                date: timelineEvent.start,
                extra: timelineEvent.extra,
                end: timelineEvent.end,
                type: timelineEvent.type,
                graduated: timelineEvent.graduated
            });
        }

        const info = require("./src/data/info.json");
        store.addMetaData('name', info.name);
        store.addMetaData('country', info.address.country);
        store.addMetaData('city', info.address.city);
        store.addMetaData('dateOfBirth', info.dateOfBirth);

        const contacts = store.addContentType({
            typeName: 'ContactMethod'
        });
        for(const contact of info.contact) {
            contacts.addNode({
                title: contact.type,
                content: contact.username
            });
        }

        const languages = store.addContentType({
            typeName: 'Language'
        });
        for(const language of info.languages) {
            languages.addNode({
                title: language
            });
        }

        process.stdout.write("Loading Toots\n");
        let typeInst;
        const postAttachment = (graphql) => {
                if(!typeInst) {
                    typeInst = new graphql.GraphQLNonNull(new graphql.GraphQLList(new graphql.GraphQLObjectType({
                        name: 'MicroblogAttachment',
                        fields: {
                            type: {
                                type: graphql.GraphQLString
                            },
                            preview: {
                                type: graphql.GraphQLString
                            },
                            alt: {
                                type: graphql.GraphQLString
                            },
                            height: {
                                type: graphql.GraphQLFloat
                            },
                            width: {
                                type: graphql.GraphQLFloat
                            }
                        }
                    })));
                }
                return typeInst;
            },
            toots = await getToots(info.mastodon.id, info.mastodon.baseUrl),
            tootStore = store.addContentType({
                typeName: 'Toot'
            });
        tootStore.addSchemaField('attachments', ({ graphql }) => ({
            type: postAttachment(graphql),
            resolve(node) {
                return node.attachments;
            }
        }));
        for(const toot of toots.data) {
            if(toot.visibility === 'public' && !toot.reblog) {
                tootStore.addNode({
                    id: toot.id,
                    path: toot.uri,
                    excerpt: toot.content,
                    date: toot.created_at,
                    content: toot.spoiler_text,
                    attachments: toot.media_attachments.map((a) => ({
                        type: a.type,
                        preview: a.preview_url,
                        alt: a.description || '',
                        height: a.meta && a.meta.small && a.meta.small.height,
                        width: a.meta && a.meta.small && a.meta.small.width
                    })),
                    language: toot.language
                });
            }
        }

        process.stdout.write("Loading Tweets\n");
        try {
            const tweets = await getTweets(info.twitter),
                tweetStore = store.addContentType({
                    typeName: 'Tweet'
                }),
                START = 0,
                END = 1;
            tweetStore.addSchemaField('attachments', ({ graphql }) => ({
                type: postAttachment(graphql),
                resolve(node) {
                    return node.attachments;
                }
            }));
            for(const tweet of tweets) {
                const supportedMedia = ((tweet.extended_entities && tweet.extended_entities.media) || (tweet.entities && tweet.entities.media) || []).filter((a) => a.type === 'photo' || a.type === 'video');
                let tweetText = tweet.full_text,
                    offset = 0;
                // This is a very crude way to remove media links and probably breaks url entities for auto linking.
                for(const media of supportedMedia.sort((a, b) => b.indices[START] - a.indices[START])) {
                    const start = media.indices[START] - offset,
                        end = media.indices[END] - offset;
                    tweetText = tweetText.substring(START, start) + tweetText.substring(end);
                    offset += media.indices[END] - media.indices[START];
                }
                tweetStore.addNode({
                    id: tweet.id_str,
                    path: `https://twitter.com/status/${tweet.user.screen_name}/${tweet.id_str}`,
                    excerpt: twitterText.autoLink(tweetText, {
                        urlEntities: tweet.entities.url
                    }),
                    date: new Date(tweet.created_at).toISOString(),
                    attachments: supportedMedia.map((a) => ({
                        type: 'image',
                        preview: a.media_url_https,
                        alt: a.display_url,
                        width: a.sizes.small.w,
                        height: a.sizes.small.h
                    })),
                    language: tweet.lang
                });
            }
        }
        catch(e) {
            console.error("Error while fetching tweets", e);
        }
        //TODO turn mastodon and twitter user IDs into the actual usernames for URLs n stuff
    });
};
