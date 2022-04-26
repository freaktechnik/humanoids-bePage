"use strict";
// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { default: mastodonGenerator } = require("megalodon"),
    graphql = require("gridsome/graphql"),
    FeedParser = require("feedparser"),
    getStream = require("get-stream"),
    fetch = (...fetchArguments) => import("node-fetch").then(({ default: fetchFunction }) => fetchFunction(...fetchArguments)), //eslint-disable-line node/no-unsupported-features/es-syntax, node/no-unpublished-import
    NEXT = 1,
    ID_WIDTH = 3,
    TALK_TYPES = new Set([
        'talk',
        'workshop'
    ]),
    PROJECT_TYPES = new Set([
        'service',
        'cli',
        'library',
        'website',
        'twitch-extension',
        'browser-extension'
    ]),

    getToots = (userId, baseUrl) => {
        const mastoAPI = mastodonGenerator(
            'mastodon',
            baseUrl
        );
        return mastoAPI.getAccountStatuses(userId);
    },

    getFeed = async (url) => {
        const parser = new FeedParser({
                feedurl: url
            }),
            response = await fetch(url);
        if(response.ok) {
            response.body.pipe(parser);
            return getStream.array(parser);
        }
        return [];
    };

module.exports = function(api) {
    api.loadSource(async (store) => {
        store.addSchema(new graphql.GraphQLSchema({
            types: [
                new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
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
                new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
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
                new graphql.GraphQLNonNull(new graphql.GraphQLEnumType({
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
                }))
            ]
        }));
        store.addSchemaResolvers({
            Project: {
                type: {
                    type: 'ProjectTypeEnum',
                    resolve(node) {
                        return node.type.toUpperCase();
                    }
                },
                tag: {
                    type: 'ProjectTagEnum',
                    resolve(node) {
                        return node.tag.toUpperCase().replace('-', '_');
                    }
                }
            },
            TimelineEvent: {
                type: {
                    type: 'TimelineType',
                    resolve(node) {
                        return node.type.toUpperCase().replace('-', '_');
                    }
                }
            },
            Toot: {
                attachments: {
                    type: '[MicroblogAttachment]',
                    resolve(node, arguments_, context) {
                        const collection = context.store.getCollection('MicroblogAttachment');
                        return node.attachments.map((attachment) => collection.getNodeById(attachment.id));
                    }
                }
            },
            Tweet: {
                attachments: {
                    type: '[MicroblogAttachment]',
                    resolve(node, arguments_, context) {
                        const collection = context.store.getCollection('MicroblogAttachment');
                        return node.attachments.map((attachment) => collection.getNodeById(attachment.id));
                    }
                }
            },
            Track: {
                attachments: {
                    type: '[MicroblogAttachment]',
                    resolve(node, arguments_, context) {
                        const collection = context.store.getCollection('MicroblogAttachment');
                        return node.attachments.map((attachment) => collection.getNodeById(attachment.id));
                    }
                }
            }
        });

        const archive = store.addCollection({
            typeName: "Archive"
        });
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

        const resume = require("./src/data/resume.json"),
            events = store.addCollection({
                typeName: "Event"
            }),
            talks = store.addCollection({
                typeName: "Talk"
            }),
            eventItems = resume.projects.filter((p) => TALK_TYPES.has(p.type));
        talks.addReference("event", "Event");

        for(const talk of eventItems) {
            const eventNode = events.addNode({
                title: talk.entity,
                date: talk.startDate,
                url: talk.eventUrl
            });
            talks.addNode({
                title: talk.name,
                slides: talk.url,
                recording: talk.recordingUrl,
                event: eventNode.id,
                date: talk.startDate
            });
        }

        const projects = store.addCollection({
                typeName: "Project"
            }),
            projectItems = resume.projects.filter((p) => PROJECT_TYPES.has(p.type));
        for(const [
            id,
            project
        ] of projectItems.entries()) {
            projects.addNode({
                title: project.name,
                source: project.source,
                url: project.url,
                type: project.roles.includes('Lead Developer') ? 'creating' : 'contributing',
                tag: project.type,
                id: (id + NEXT).toString().padStart(ID_WIDTH, '0')
            });
        }

        const timeline = store.addCollection({
                typeName: 'TimelineEvent'
            }),
            civilServiceItems = resume.projects.filter((p) => p.type === 'civil service');
        for(const timelineEvent of resume.work) {
            timeline.addNode({
                title: timelineEvent.position,
                date: timelineEvent.startDate,
                extra: [
                    {
                        title: timelineEvent.company,
                        content: timelineEvent.location
                    },
                    {
                        title: timelineEvent.description,
                        content: timelineEvent.summary
                    }
                ],
                end: timelineEvent.endDate,
                type: "work"
            });
        }
        for(const timelineEvent of resume.education) {
            //TODO somehow get graduated flag
            timeline.addNode({
                title: timelineEvent.institution,
                date: timelineEvent.startDate,
                extra: timelineEvent.area ? [ {
                    title: timelineEvent.area,
                    content: timelineEvent.studyType
                } ] : [],
                end: timelineEvent.endDate,
                type: "education"
                //graduated: timelineEvent.graduated
            });
        }
        for(const timelineEvent of civilServiceItems) {
            timeline.addNode({
                title: timelineEvent.name,
                date: timelineEvent.startDate,
                extra: [ {
                    title: timelineEvent.entity,
                    content: timelineEvent.description
                } ],
                end: timelineEvent.endDate,
                type: "civil-service"
            });
        }

        store.addMetadata('name', resume.basics.name);
        store.addMetadata('country', resume.basics.location.countryCode);
        store.addMetadata('city', resume.basics.location.city);
        store.addMetadata('dateOfBirth', resume.basics.dateOfBirth);
        store.addMetadata('teaser', resume.basics.summary);


        const profiles = store.addCollection({
                typeName: 'Profile'
            }),
            contacts = store.addCollection({
                typeName: 'ContactMethod'
            });
        for(const profile of resume.basics.profiles) {
            profiles.addNode(profile);
            if(profile.network === 'Matrix' ) {
                contacts.addNode({
                    title: 'matrix',
                    content: profile.username,
                    url: profile.url
                });
            }
        }

        contacts.addNode({
            title: 'email',
            content: resume.basics.email
        });
        contacts.addNode({
            title: 'pgp',
            content: resume.basics.pgp
        });

        const languages = store.addCollection({
            typeName: 'Language'
        });
        for(const language of resume.languages) {
            languages.addNode({
                title: language
            });
        }

        process.stdout.write("Loading Toots\n");
        const mastodonInfo = resume.basics.profiles.find((p) => p.network === 'Mastodon'),
            profileUrl = new URL(mastodonInfo.url),
            baseUrl = `${profileUrl.protocol}//${profileUrl.hostname}/`,
            toots = await getToots(mastodonInfo.id, baseUrl),
            tootStore = store.addCollection({
                typeName: 'Toot'
            }),
            attachmentStore = store.addCollection({
                typeName: 'MicroblogAttachment'
            });
        for(const toot of toots.data) {
            if(toot.visibility === 'public' && !toot.reblog) {
                tootStore.addNode({
                    id: toot.id,
                    path: toot.uri,
                    excerpt: toot.content,
                    date: toot.created_at,
                    content: toot.spoiler_text,
                    attachments: toot.media_attachments.map((a) => {
                        const attachment = attachmentStore.addNode({
                            type: a.type,
                            previewSrc: a.preview_url,
                            alt: a.description || '',
                            height: a.meta && a.meta.small && a.meta.small.height,
                            width: a.meta && a.meta.small && a.meta.small.width
                        });
                        return store.createReference('MicroblogAttachment', attachment.id);
                    }),
                    language: toot.language
                });
            }
        }
        //TODO turn mastodon user IDs into the actual usernames for URLs n stuff

        process.stdout.write("Loading Tracks\n");
        try {
            const funkwhaleInfo = resume.basics.profiles.find((p) => p.network === 'Funkwhale');
            const tracks = await getFeed(funkwhaleInfo.feed),
                trackStore = store.addCollection({
                    typeName: 'Track'
                });
            for(const track of tracks) {
                const attachments = [];
                if(track.image.url) {
                    const attachment = attachmentStore.addNode({
                        type: 'image',
                        previewSrc: track.image.url,
                        alt: track.title,
                        width: 500,
                        height: 500
                    });
                    attachments.push(store.createReference('MicroblogAttachment', attachment.id));
                }
                trackStore.addNode({
                    id: track.guid,
                    path: track.link,
                    date: track.date.toISOString(),
                    title: track.title,
                    excerpt: track.summary,
                    content: track.description,
                    attachments,
                    language: 'en'
                });
            }
        }
        catch(error) {
            console.error("Error while fetching tracks", error);
        }
    });
};
