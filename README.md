# EZView

## Description
jQuery plugin to show images and pdf files preview

EZView is a small, unobtrusive, convenient jQuery image & PDF viewer plugin that opens and displays image and PDF files in a fullscreen modal popup.

Features image zoom, image pan and prev/next navigation. It means that the visitors are able to switch between images and PDFs without the need of clicking the files one by one.

## To see how to use and demo:
https://www.jqueryscript.net/other/Image-PDF-Viewer-EZView.html

## File supports
.pdf, .jpg, png, .jpeg, .gif

## How to use?

[selector] = Elements should to has a 'href' or 'src' attribute to show it on preview

**$([selector]).EZView();**

## Example:
* Add preview event to all visible images on page

**$('img:visible').EZView();**

## Requirements
* [jQuery](https://jquery.com/) v. 1.6+

## Optionals
jQuery draggable pluggin to allow move the image when is zoomin

## License
Released under the [MIT license](https://opensource.org/licenses/MIT).
