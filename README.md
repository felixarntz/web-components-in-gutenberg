# Web Components in Gutenberg

This WordPress plugin contains two examples for using Web Components in WordPress:

* [Tabs in WP Admin](#tabs-in-wp-admin)
* [Latest Posts block type in Gutenberg](#latest-posts-block-type-in-gutenberg)

The code in these examples uses several modern technologies and best practices and it also aims to be a 100% native to browser features. In other words, there's no preprocessing, precompiling or transpiling necessary at all for any of this code - even for the React part.

Learn more about Web Components:

* https://developers.google.com/web/fundamentals/web-components/customelements
* https://developers.google.com/web/fundamentals/web-components/shadowdom
* https://developers.google.com/web/fundamentals/web-components/best-practices

Learn more about other cool technologies and libraries used in these examples:

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
* https://developers.google.com/web/fundamentals/primers/async-functions
* https://developers.google.com/web/fundamentals/primers/promises
* https://developers.google.com/web/fundamentals/primers/modules
* https://developers.google.com/web/updates/2017/09/abortable-fetch
* https://github.com/developit/htm

## Tabs in WP Admin

Using the typical WordPress admin tabs requires to memorize quite a bit, from which tags and classes to use to several different role and ARIA attributes to make the dynamic tab functionality keyboard- ands creen reader-accessible. Furthermore the markup for tabs and their related tab panels must be printed in two separate containers, making it hard to follow.

With Web Components, all of the above can be mitigated. They can be built in an accessible way by default without requiring the developer using them to take care of it. In addition, they can intelligently use Shadow DOM and its slots feature to allow writing each tab together with its associated tab panel, resulting in a more logic DOM flow.

### Demo Video

[![Web Components Tabs in WP Admin Demo](http://img.youtube.com/vi/R0tX9s1v4hY/0.jpg)](http://www.youtube.com/watch?v=R0tX9s1v4hY "")

## Latest Posts block type in Gutenberg

With the Latest Posts block type, the implementations in the editor and the frontend are completely different and thus require you to write similar functionality twice, once in React and once in PHP. For other block types, a related problem is you often need to use the same markup in the block type's edit callback that you also use in its save callback.

Using Web Components for the output of a Gutenberg block type allows you to use the same markup for the editor as for what is saved. The relevant functionality can be included in the custom element printed by the editor (and React) so that it works similarly in the frontend (or in any context, for that matter). React rightfully remains the framework for the editor, but can combine its own strengths with the reusability of Web Components. This example showcases how they can easily work together: You define your custom elements and register your block types, with the block types simply reusing the custom elements.

### Demo Video

[![Web Components Latest Posts block type in Gutenberg Demo](http://img.youtube.com/vi/MEkMSHdP-E8/0.jpg)](http://www.youtube.com/watch?v=MEkMSHdP-E8 "")

## Disclaimer

Keep in mind that the code in this repository is demo code and may not be structured in an optimal way for a real-world project.
