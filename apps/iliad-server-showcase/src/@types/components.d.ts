// This file is generated by a script (typeSync.ts) in the associate Strapi instance. Do not modify it directly.
// Generated on: Sun, 24 Nov 2024 01:21:33 GMT

import type { Schema, Attribute } from '@strapi/strapi';

export interface EventsVenue extends Schema.Component {
  collectionName: 'components_events_venues';
  info: {
    displayName: 'Venue';
    icon: 'archive';
    description: '';
  };
  attributes: {
    price: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    title: Attribute.String &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::bold-title-editor.title',
        {
          output: 'html';
        }
      >;
    description: Attribute.RichText & Attribute.Required;
    buttons: Attribute.Component<'misc.button', true> &
      Attribute.SetMinMax<{
        max: 2;
      }>;
    startDateTime: Attribute.DateTime & Attribute.Required;
    endDateTime: Attribute.DateTime & Attribute.Required;
    coverImage: Attribute.Media;
  };
}

export interface LlmLlmSnippet extends Schema.Component {
  collectionName: 'components_llm_llm_snippets';
  info: {
    displayName: 'LLM Snippet';
    icon: 'alien';
  };
  attributes: {
    snippetContent: Attribute.Text;
  };
}

export interface MiscButton extends Schema.Component {
  collectionName: 'components_misc_buttons';
  info: {
    displayName: 'Button';
    icon: 'arrowRight';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    link: Attribute.Text & Attribute.Required;
    icon: Attribute.String & Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

export interface MiscSocialMedia extends Schema.Component {
  collectionName: 'components_misc_social_medias';
  info: {
    displayName: 'Social Media';
    icon: 'manyToMany';
  };
  attributes: {
    socialMediaProvider: Attribute.String;
    socialMediaLink: Attribute.String;
    socialMediaIcon: Attribute.String &
      Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

export interface SinglePageComponentsFrequentlyAskedQuestion
  extends Schema.Component {
  collectionName: 'components_single_page_components_frequently_asked_questions';
  info: {
    displayName: 'Frequently Asked Question';
    icon: 'question';
  };
  attributes: {
    question: Attribute.Text & Attribute.Required;
    answer: Attribute.RichText & Attribute.Required;
  };
}

export interface SinglePageComponentsMembershipBenefit
  extends Schema.Component {
  collectionName: 'components_single_page_components_membership_benefits';
  info: {
    displayName: 'Membership Benefit';
    icon: 'emotionHappy';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    link: Attribute.String;
    icon: Attribute.String &
      Attribute.Required &
      Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

export interface SiteConfigContactInfo extends Schema.Component {
  collectionName: 'components_site_config_contact_infos';
  info: {
    displayName: 'Contact Info';
    icon: 'phone';
  };
  attributes: {
    address: Attribute.String;
    zipCode: Attribute.String;
    city: Attribute.String;
    state: Attribute.String;
    emailAddress: Attribute.String;
    phoneNumber: Attribute.String;
    availability: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'events.venue': EventsVenue;
      'llm.llm-snippet': LlmLlmSnippet;
      'misc.button': MiscButton;
      'misc.social-media': MiscSocialMedia;
      'single-page-components.frequently-asked-question': SinglePageComponentsFrequentlyAskedQuestion;
      'single-page-components.membership-benefit': SinglePageComponentsMembershipBenefit;
      'site-config.contact-info': SiteConfigContactInfo;
    }
  }
}
