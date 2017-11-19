![ChatUI](https://github.com/svift-org/ChatUI/blob/master/README/ChatUI-Logo.png?raw=true)

# ChatUI
A javascript chatbot library for frontend / UI development

![ChatUI](https://github.com/svift-org/ChatUI/blob/master/README/Snapshot.png?raw=true)

## Introduction

There are already many javascript chatbot libraries on the market. Why another one? Most chatbot libraries and frameworks mix MVC patterns. Many libraries for example already inlcude some kind of logic to organize and handle the conversation with the user. This makes it difficult to implement them if you have your own ideas for handling the input and maybe even already your own logic module. Therefore, we decided to completely separate frontend (view) and logic (controller, model). ChatUI is simply helping you get your chat UI going.

Try it out:
- [D3](https://svift-org.github.io/ChatUI/examples/d3.html)
- [Complex](https://svift-org.github.io/ChatUI/examples/complex.html)
- [Extend](https://svift-org.github.io/ChatUI/examples/extend.html)
- [jQuery](https://svift-org.github.io/ChatUI/examples/jquery.html) (STILL IN THE MAKING)
- [Standalone](https://svift-org.github.io/ChatUI/examples/standalone.html) (STILL IN THE MAKING)

## Usage

More details can be found in the [docs](https://svift-org.github.io/ChatUI/docs/chatUI.html).

Select a container element (e.g. div) and send it to the constructor. Make sure set the height for that element (see examples/d3.html).

```javascript
var chat = chatUI(d3.select('#chatbot'));
```

After initialising, you can activate the input module. The whole library strongly builds upon callbacks. 

```javascript
chat.showInput(function(input){
  //This function is called when input is submitted by the user
}, function(input){
  //This function is called when the user inputs text
});
```

The second function is optional.

Beyond the text input, the core of the library are different bubble types. There are two types build in, other types can be added (see next section). addBubble always returns an ID for the added bubble.

```javascript
//Text Bubble
chat.addBubble({
  //type of bubble (text or select)
  type: 'text',
  //text for the bubble (text or html)
  value: 'Hi there!',
  //speaker (bot or human)
  class: 'bot',
  //show typing bubbles (0-n ms)
  delay: 1000 
}, function(){
  //callback is called after delay is over
});
```

```javascript
//Select Bubble
chat.addBubble({
  //type of bubble (text or select)
  type: 'select',
  //array of objects for the select (only the label attribute is required)
  value: [
    {
      label:'yes',
      value:1
    },
    {
      label:'no',
      value:0
    }
  ],
  //speaker (bot or human)
  class: 'bot'
}, function(selection){
  //callback is called after user selects something, the selection is the selected object from the value array
});
```

## Extending ChatUI

The chat.types object can be freely extended.

```javascript
chat.types.image = function(bubble, options, callback){
  //bubble is a d3 selection of the current container
  //options is the object passed to addBubble
  //callback is the function passed to addBubble
};
```

```javascript
var hw = 0;
cb.type.hello = function(bubble, options, callback){
  hw++;
  bubble.append('p').text('Hello World ('+hw+')');
};

cb.addBubble({type:'hello', class:'bot'});
cb.addBubble({type:'hello', class:'human'});
```

An example for an extension is provided in examples/extend.html

## Styling

Most of the things you will likely want to change you can find in the src/css/variables.scss. All ChatUI classes and ids use the namespace 'cb-' Most importantly the icons for human and bot can be changed from build/assets/...

## Other useful Functions

Hide the input module
```javascript
chat.hideInput();
```

Remove a bubble by ID
```javascript
module.removeBubble(ID);
```
Remove all bubbles until ID is reached
```javascript
module.removeBubbles(ID);
```

Get a selection of the bubble with ID
```javascript
module.getBubble(ID);
```

Scroll chat to start or end
```javascript
module.scrollTo('start'||'end');
```

## Flavors

The library comes in three flavors:

- Standalone (chatui[.min].js) {STILL IN THE MAKING}
- D3 (chatui-d3[.min].js) | https://d3js.org (v4)
- jQuery (chatui-jquery[.min].js) | https://jquery.com (v3) {STILL IN THE MAKING}

Underlying dependencies are not inlcuded. 

We build this system for a D3 project. In order to make it easier for others to include we added the two other flavors.

### Difference between flavors

Beyond the internal differences between the flavors, there are two important differences for implementing different flavors:

#### 1. Initialisation

#### 2. Building Objects


## About the project

![SVIFT](https://github.com/svift-org/ChatUI/blob/master/README/svift.png?raw=true)

ChatUI is part of the [SVIFT](http://svift.xyz) project, a novel system for quickly and easily creating data visualisations for the web, print and video. [SVIFT](http://svift.xyz) is being developed by [Sebastian Meier](https://github.com/sebastian-meier/), [Alsino Skowronnek](https://github.com/alsino) and [Hans Hack](https://github.com/hanshack).

The project is being supported by http://www.miz-babelsberg.de

![MIZ](https://github.com/svift-org/ChatUI/blob/master/README/miz.png?raw=true)