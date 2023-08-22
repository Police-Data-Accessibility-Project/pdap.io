# Design System
These are styling resources like CSS and templates for new PDAP microservices or branded web projects.

Open `system/demo.html` to see how things look.

`system/css/global-styles.css` are the styles used across all PDAP applications.

`system/css/normalize.css` is used for more consistent cross-browser rendering.

`system/images` are icons and brand assets.

# Usage
1. In the project's directory:

```
npm install pdap-design-system
```

2. Without moving the CSS files, reference them like this:

```
  <link href="node_modules/pdap-design-system/system/css/normalize.css" rel="stylesheet" type="text/css">
  <link href="node_modules/pdap-design-system/system/css/global-styles.css" rel="stylesheet" type="text/css">
  ```



## Principles
This is a first pass, so they're not etched in stone. Open to suggestions.

We are making tools for transparency about a serious subject. We should be focused, friendly, and open.
- Our design should take accessibility seriously. 
- Keep it simple: things should not do anything they don't need to do. 
- We should keep our users informed and in control with timely, relevant feedback.
- Things that look the same should behave in the same way, and an action should always produce the same result.
- Don't reinvent the wheel: use standard conventions and cues.
- Provide help to people in context, not in the docs.
- Establish good visual hierarchy by ensuring each page and object has a primary function.

## Assets
Use these [brand assets](https://docs.pdap.io/meta/about/staff/brand-assets).
Use this [terminology](https://docs.pdap.io/activities/terms-and-definitions).

## Other notes
This is based on the PDAP website, which was originally created in Webflow. That might explain some of the CSS browser compatibility choices.