![ChatUI]()

# ChatUI
A javascript chatbot library for frontend / UI development

## Introduction

There are already many javascript chatbot libraries on the market. Why another one? Most chatbot libraries and frameworks mix MVC patterns. Many libraries for example already inlcude some kind of logic to organize and handle the conversation with the user. This makes it difficult to implement them if you have your own ideas for handling the input and maybe even already your own logic module. Therefore, we decided to completely separate frontend (view) and logic (controller, model). ChatUI is simply helping you get your chat UI going.

## Usage

## Extending ChatUI

## Examples

## Flavors

The library comes in three flavors:

- Standalone (chatui[.min].js)
- D3 (chatui-d3[.min].js) | https://d3js.org (v4)
- jQuery (chatui-jquery[.min].js) | https://jquery.com (v3)

Underlying dependencies are not inlcuded. 

We build this system for a D3 project. In order to make it easier for others to include we added the two other flavors.

### Difference between flavors

Beyond the internal differences between the flavors, there are two important differences for implementing different flavors:

#### 1. Initialisation

#### 2. Building Objects

  //Default Bubble Types
  //The individual types are being organised this way in order to make it as easy as possible to extend the basic types.
  //cb.types['custom-1'] = function(bubble, options, callback){ custom_code; };

  /*

 //Example for custom bubble type

 var hw = 0;
 cb.types['hello'] = function(bubble, options, callback){
   hw++;
   bubble.append('p').text('Hello World ('+hw+')');
 };

 cb.addBubble({type:'hello', class:'bot'});
 cb.addBubble({type:'hello', class:'human'});

 */
