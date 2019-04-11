"use strict";
/*
 * jQuery plugin to show images and pdf files on preview
 * https://github.com/guillermodiazga/EZView
 *
 * Copyright 2017, Guillermo Diaz
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/**
 * Check if jQuery is loaded
 */
if (!window.jQuery) {
    throw Error('jQuery is required');
}

/**
 * Plugin Definition
 * @param {string} collectionName [This galery name in use to create a set of images and navigate through them]
 * 
 * Viewer will create inside the body a container by each collection of images
 *  <.EZView #EZView[auto-numeric-collection]>
 *      <.image-collection>
 *          <img [index-content = EZView[auto-numeric-collection][auto-numeric-img]]>
 *      </.image-collection>
 *  </.EZView> 
 *  
 *  e.g.
 *  
 *  <body>
 *      <.EZView #EZView0>
 *          <.image-collection>
 *              <img [index-content = EZView00]>
 *              <img [index-content = EZView01]>
 *              <img [index-content = EZView02]>
 *          </.image-collection>
 *      </.EZView>
 *      <.EZView #EZView1>
 *          <.image-collection>
 *              <img [index-content = EZView10]>
 *              <img [index-content = EZView11]>
 *          </.image-collection>
 *      </.EZView>
 *  </body>
 *  
 */
$.fn.EZView =  function(collectionName) {
    var self = this;

    if (!$(self).length) {
        throw Error('No jQuery elements found');
    }

    /**
     * Initial actions
     * @return void
     */
    self.constructor = function() {

        var $thumbnails = $(this);

        self.$EZView   = null;
        self.arContent = [];
        self.index     = [];

        self.icons = {
            'next':     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA1OUQzQkZEMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1OUQzQkZDMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po6G6sQAAAB/SURBVHjaYvj//z8DDANBARALIIvhw8gaFwAxiHGBWAPQNf4nxQBsGok2gAGq6D85BoCAALkGwEwgywBkJ5BsALofSDIAWyAQbQCuUCTKACYGSgDVnE12gJEdVWQnEoqSJyUZgwmqABu4CMQOQEUf8EYV2YUBxcUQuQUgQIABAENaIhLMSm8LAAAAAElFTkSuQmCC',
            'back':     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA1OUQzQzAxMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1OUQzQzAwMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjJSsWEAAAB3SURBVHjaYvj//z8DMRgIBIC4AEWMBI0XgBjEWUC0ZjSN/5ENIEcj3AByNf4Hy5GtEaSGXI0YfiZFI4pmUjXCNZOjEaqPPI0gzMRACaDI2RQHGMVRRXEioTh5kmIAE55Y+ACkHID4Ig4lF2hXGFBcDOErAAECDAApfSISSEStFwAAAABJRU5ErkJggg==',
            'download': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM2MDhDRDE0MDY5RDExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM2MDhDRDEzMDY5RDExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqrnV/wAAACxSURBVHjaYvz//z8DIcDIyPgBSPGjiwP1MhLUS6QFWBURYwETA43BqAWjFgwBC0CZBQUDASjX/icTf0A3D5sPHID4I5nuDSDoA6gvEshwfQJWs7AJkmHJBJzm4JKAWrKACMMX4DUDnyTUkg14DL8AxAKUWiAANQjd8AeEDCfKAiRLkJMviG1AlF5iFEEtMUCyxIFYfYxQTfw0yscfGaEuGjplEaieRq6rh54P0AFAgAEAR8yvtAJdObEAAAAASUVORK5CYII=',
            'zoomIn':   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg5MkI5ODJFMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MkI5ODJEMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtK4jPoAAAFgSURBVHjarFZRccMwDLVz+58hlMHKYIYQCIUQCINQCBmDQMgYdAwMwUPgWYtyp2lSZa/R3bsktqwXyfJLfCnFSea9j/UyVpzZVKpY6rrFtRqQUGDQFaYMANnI10vgBJeG4BxzM8kdAsjqDQElyr1EO0EUFkLAk1DOgITcf7JI+B5czBJsTUHXQIZB8f2TxSI4QYAsjE8t2YBdmaNUorI1ohgg0f2TfAZ2Dj7qYHJ9Rs/Lq+QwsOeVHMZcUQBkrCCytEazwT1u2XJ4Ys9nogSBZoBjXogRWzKhexBrwNCZyUjuPzUSunHP2JbcvhBcRIHgRWmC3wLJ2rC0CB+WNlvtT0/82CUTmz8nWFsEclbk/IpBI2rWrVeR+RvO/5B6k8gpepQbA64tRFrNA5JJQW5YtpOR/XyXpBcW0SEkBtF0hHbt5w0+3+/CVDosEyWjny+s1/67HrEqN9A0af83+xZgABRpKnOx6YemAAAAAElFTkSuQmCC',
            'zoomOut':  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg5MkI5ODMyMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MkI5ODMxMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqDoPeEAAAFMSURBVHjarJUBkYQwDEUpCioBB4eDq4SVUAknAQlIQMJKQALrgHPQVcAmO2Unl0loepCZPwy06WvSkLpt2xrJnHMRHgHUsaEFNIHf0lgNIVRgN9CKQwXNoJ77S+KAybA4VzRDFEAC3UFD1vwf0A4YBEf85oV0dhnM56upQ/N5x3T3xVyDjfyMjiA8ih/LYWbnuyWavST3SasVQFL3J8XSvBYGvkhFT02FwQJY6g/yKUjzWvY+k58xgTZFSfLRrG3OW6qF9CQVWL5OkS+liEN+yfutJgRIG8K+WV8Tjdd7qKguk69UhpjjzgCIzG8ttZVRAIUDgNiGShDPfspdS14w5PMaC9dALHVhDXS69fM0eCF1mtLBpqIKYT1pVBaZ86H7QvTxEFLZJIug0xADqL+idyEo5Qp8sKHn++yuiESJ6HPDXgohoIHeki8BBgDP751LFBCcbgAAAABJRU5ErkJggg==',
            'close':    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdGODJCNTUzMDZBMzExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdGODJCNTUyMDZBMzExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PshQd58AAAB+SURBVHjarJTdCcAgDIRDJ3AU95+io7hBmkAsFuWSwgn3oudnflRRVbHRTcN0m5rPIbknvL6nx9wL0RCELZDpH8H4QCDsAFlhx4UNBiDTmxpayVM8LY1aiqHnqReLmTZDfnQGdvQS1qCnRik2pf20C8l8IrRHy/lGWB/bI8AA4oOVMKhFFb8AAAAASUVORK5CYII=',
        };

        // If we have a collection set it otherwise set an default name
        collectionName = collectionName || 'EZView' + (parseInt($('.EZView').length));

        // Create container by collection
        self.createContainer();

        /**
         * index is the current image showing by collection
         * @type {Array}
         */
        self.index[collectionName] = 0;

        /**
         * arContent allow to have all the images information to be show by collection
         * @type {Array}
         */
        self.arContent[collectionName] = [];

        // Iterate each element and set the click event
        $thumbnails.each(function(i, thumbnail) {
            let $thumbnail = $(thumbnail);

            // Check if the element exists
            if (!$thumbnail.length) {
                return;
            }

            try {
                // Set all the data requiered to navigate through elements
                self.arContent[collectionName][i]          = [];
                self.arContent[collectionName][i].href     = $thumbnail.attr('href') || $thumbnail.attr('src');
                self.arContent[collectionName][i].name     = $thumbnail.attr('title') ? $thumbnail.attr('title').substring(0,30) : '';
                self.arContent[collectionName][i].isRender = false;
                self.arContent[collectionName][i].isImg    = true;
            } catch(e) {
                console.error(e);
                console.error(el);
            }

            // Set $thumbnail properties
            $thumbnail
                // Set index as data property on each $thumbnail element
                .data('index', i)

                // Add cursor pointer
                .css({cursor: 'pointer'})

                // Add events to each element
                .off().click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    self.runEZView(e);
                });
        });
    }

    /**
     * Methods Definition:
     */

     /**
      * Return image to original measures
      * @param  {int} index [description]
      * @return void
      */
    self.returnImageToOriginalMeasures = function (index) {

        if (!self.isImg(index)) {
            return;
        }

        var $img             = $('[index-content=' + collectionName + index + ']', self.$EZView),
            hasOriginalSizes = self.arContent[collectionName][index]['original-height'];

        if (hasOriginalSizes) {
            $img.animate({
                'height':  self.arContent[collectionName][index]['original-height'] + 'px',
                'width':   self.arContent[collectionName][index]['original-width'] + 'px'
            }, 200);

            // Center img over container
            $img.css({top:'auto', left:'auto'});
        }
    };

    /**
     * Create the collection container
     * @return void
     */
    self.createContainer = function() {

        if (!$('#EZView' + collectionName).length) {

            var tools = 
                '<div class="tools-container">' +
                    '<spam class="name"><b></b></spam>' +
                    '<spam class="tools">' +
                        '<a class="download EZViewHighlight" download="FileName" target="_blank">' +
                        '<img src="' + self.icons.download + '" title="Download" /></a>' +
                        '<a class="zoomIn EZViewHighlight" href="">' +
                        '<img src="' + self.icons.zoomIn + '" title="Zoom in [hotkey +]" /></a>' +
                        '<a class="zoomOut EZViewHighlight" href="">' +
                        '<img src="' + self.icons.zoomOut + '" title="Zoom out [hotkey -]" /></a>' +
                    '</spam>' +
                    '<a class="close EZViewHighlight" href="">' +
                    '<img src="' + self.icons.close + '"/></a>' +
                '</div>',

                container = '<div class="image-collection"/>' +
                        '<a class="back EZViewHighlight"><img src="' + self.icons.back + '" title="Back [hotkey <]" /></a>' +
                        '<a class="next EZViewHighlight"><img src="' + self.icons.next + '" title="Next [hotkey >]" /></a>' +
                        tools,

                template = '<div id="' + collectionName + '" ' + 
                           'class="EZView EZView-container hide" style="display: flex; align-items: center; justify-content: center">' +
                           container + '</div>';

            try {
                $('body').append(template);
            } catch(e){
                console.error('Error creating container: ' + e);  
            }

            self.$EZView = $('#' + collectionName).hide();

            self.addEvents();
        }
    };

    /**
     * Check if the index belongs to any img
     * @param  {int}  imgIndex index to be checked
     * @return {boolean}       To know if the index belongs to any img
     */
    self.isImg = function(imgIndex) {
        return self.arContent[collectionName][imgIndex].isImg;
    };

    /**
     * Show controlls acording of the current image
     * @param  {int} imgIndex index image to be checked
     * @return void
     */
    self.showOrHideControls = function(imgIndex = self.index[collectionName]) {
        var href = self.arContent[collectionName][imgIndex].href,
            name = self.arContent[collectionName][imgIndex].name;

       if (self.isImg(imgIndex)) {
            $('.zoomIn, .zoomOut').fadeIn(200);
        } else {
            $('.zoomIn, .zoomOut').fadeOut(200);
        }

        $('.download').attr('href', href);

        $('.name>b').html(name);

        if (imgIndex > 0) {
            $('.back').fadeIn(200);
        } else {
            $('.back').fadeOut(200);
        }

        if (imgIndex < self.arContent[collectionName].length-1) {
            $('.next').fadeIn(200);
        } else {
            $('.next').fadeOut(200);
        }
    };

    self.buildHtmlContent = function() {
        var imgIndex = self.index[collectionName],
            src      = self.arContent[collectionName][imgIndex].href,
            isPdf    = src.match('.pdf');
        
        // Content to show 
        var htmlContent = '<img index-content="' + collectionName + imgIndex + '" src="' + src + '" class="content" />';

        // To show pdf files
        if (isPdf) {
            htmlContent = '<iframe class="content" frameborder="0" index-content="' + collectionName + imgIndex +
                '" height="' + $(window).height() * 0.95 + '" width="' + $(window).width() * 0.9 +
                '" src="' + src + '" type="application/pdf"><p>Your browser does not support iframes.</p>'+
                '<script type="text/javascript">alert("Your browser does not support iframes.")</script><iframe/>';

            self.arContent[collectionName][imgIndex].isImg = false;
        }

        return htmlContent;
    };

    /**
     * Set img on view container
     * @param string htmlContent
     */
    self.setContentOnViewer = function(htmlContent) {
        var newIndex = self.index[collectionName];

        // Append object to body
        self.$EZView.find('.image-collection')

            // Add img in container
            .append(htmlContent)

            // Stop propagation
            .find('.download, img').click(function(e) {
                // Avoid trigger remove action
                e.stopPropagation();
            });

        // Check If href isn't exists and show unsuported msg
        $('[index-content=' + collectionName + newIndex + ']').on( "error",function() {
            var style = 'padding: 10px; border-radius: 10px; background-color: rgba(255,255,255,0.6)';

            $(this).replaceWith('<h1 class = "content" index-content="' + collectionName + self.index[collectionName] + '" style="' + style + '">Unsupported preview</h1>');

            self.arContent[collectionName][self.index[collectionName]].isImg = false;
        });

        self.setStyles();

        self.showOrHideControls(newIndex);
    };

    self.setStyles = function() {
        // Set Styles
        self.$EZView
            .css({
                'background-color': 'rgba(0,0,0,0.5)!important',
                'height':           '100%',
                'width':            '100%',
                'z-index':          '10000',
                'position':         'fixed',
                'top':              '0',
                'left':             '0',
                'cursor':           'default',
                'aling-items':      'center',
                'margin':           'auto',
            })

            .find('.content').css({
                'max-width':  $(window).width()*0.7,
                'max-height': $(window).height()*0.9,
                'width':      $(window).width()*0.5, // Inicial image width
                'z-index':    '10001',
            }).end()

            .find('.name').css({
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'padding':  '7px',
            }).end()

            .find('.close>img').css({
                'top':      '0',
                'right':    '0',
                'position': 'fixed',
            }).end()

            .find('.back>img').css({
                'top': $(window).height()*0.5,
                'left': '0',
                'position': 'fixed',
            }).end()
            .find('.next>img').css({
                'top': $(window).height()*0.5,
                'right': '0',
                'position': 'fixed',
            }).end()

            .find('.tools-container').css({
                'background-color': 'rgba(255,255,255,0.5)',
                'height':           '35px',
                'width':            '100%',
                'position':         'fixed',
                'top':              '0',
                'left':             '0',
                'padding':          '3px',
                'padding-top':       '0px',
                'z-index':          '100000'
            }).end()

            .find('.tools-container>a').css({
                'margin' : '10px',
            }).end()

            .find('.tools').css({
                'top':      '0',
                'left':    '0',
                'position': 'fixed',
            }).end()

            .find('.EZViewHighlight>img').css({
                'padding': '10px',
                'height':  'auto',
                'width':   'auto',
                'z-index': '100000',
                'cursor':  'pointer',
            }).end()

            .find('.EZViewHighlight>img').hover(
                function() {
                    $(this).css({
                        'border-radius':    '100%',
                        'background-color': 'rgba(255,255,255,0.5)',
                        'z-index':          '100000'
                    });
                },
                function() {
                    $(this).css({
                        'background-color': '',
                        'border-radius':    '',
                    });
                }
            );
    };

    /**
     * Set keyboard events
     * @param  {object} e Window object
     * @return void
     */
    self.keyupEvents = function(e) {
        var keyCode = e.keyCode;

        switch(keyCode) {
        // Esc
        case 27:
            self.close();
            break;

        // Next 
        case 39:
            self.next();
            break;

        // Back
        case 37:
            self.back();
            break;

        // zoomn
        case 107:
            self.zoom(true);
            break;

        // zoomOut
        case 109:
            self.zoom();
            break;
        }
    };
    
    /**
     * Hide collection
     * @return void
     */
    self.close = function () {
        // Hide EZView elements
        self.$EZView.hide(200)
        
        self.returnImageToOriginalMeasures(self.index[collectionName]);

        // Remove keyup events
        $(window).off('keyup', null, self.keyupEvents);
    };

    /**
     * zoom in or out on current img
     * @param  {boolean} increment When is true do zoom in
     * @return void
     */
    self.zoom = function (increment) {
        if (!self.isImg(self.index[collectionName])) {
            return;
        }

        var $img   = $('[index-content=' + collectionName + self.index[collectionName] + ']', self.$EZView),
            height = parseInt($img.css('height')),
            width  = parseInt($img.css('width'));
        
        // Allow the image to return to its original measures when is closed or the focus is lost
        if (!self.arContent[collectionName][self.index[collectionName]]['original-height']) {
            self.arContent[collectionName][self.index[collectionName]]['original-height'] = height;
        }

        if (!self.arContent[collectionName][self.index[collectionName]]['original-width']) {
            self.arContent[collectionName][self.index[collectionName]]['original-width'] = width;
        }

        // Avoid lose img proportions on zoom in
        $img.css({
            'max-width': '',
            'max-height': '',
        });

        // Enable drag if we have the pluging available
        if ($.fn.draggable) {
            $img
                .draggable()
                .css({'cursor': 'move'});
        }

        // Increase or decrease sizes
        if (increment) {
            height += height * 0.2;
            width  += width * 0.2;
        } else {
            height -= height * 0.2;
            width  -= width * 0.2;
        }

        // Do the zoom
        $img.animate({
            'height': (height)+'px',
            'width': (width)+'px'
        }, 200);
    };

    self.addEvents = function() {

        // Main container
        self.$EZView

            // Add close Event
            .click(function(e) {
                e.stopPropagation();
                e.preventDefault();

                self.close();
            })

            // Add close Event
            .find('.close>img').click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.close();
            }).end()

            // Stop propagation
            .find('.download, img, .tools').click(function(e) {
                // Avoid trigger remove action
                e.stopPropagation();
            }).end()

            // Add back event
            .find('.back>img').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.back();
            }).end()

            // Add next event
            .find('.next>img').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.next();
            }).end()

            // Add prevent default
            .find('.zoomIn, .zoomOut, .close').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
            }).end()

            // Add zoomIn event
            .find('.zoomIn>img').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.zoom(true);
            }).end()

            // Add zoomOut event
            .find('.zoomOut>img').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.zoom();
            });
    };

    /**
     * Calculate the new index and call to show that img
     * @return void
     */
    self.next = function() {

        var newIndex = self.index[collectionName] + 1;

        // Check if the link element is visible over the DOM
        if (!self.arContent[collectionName][newIndex]) {
            return;
        }

        // Check if the element exists
        var hrefExist = $('[href="' + self.arContent[collectionName][newIndex].href + '"]:visible').length,
            srcExist = $('[src="' + self.arContent[collectionName][newIndex].href + '"]:visible').length,
            goToNext = hrefExist || srcExist;

        // If the element does not exists on view, go to the next img
        if(!goToNext) {

            self.index[collectionName] += 1;

            return self.next();
        }

       self.goTo(newIndex);
    };

    /**
     * Calculate the new index and call to show that img
     * @return void
     */
    self.back = function() {
        var newIndex = self.index[collectionName] - 1;

         // Check if exist next image
        if (!self.arContent[collectionName][newIndex]) {
            return;
        }

        // Check if the link element is visible over the DOM
        var hrefExist = $('[href="' + self.arContent[collectionName][newIndex].href + '"]:visible').length,
            srcExist = $('[src="' + self.arContent[collectionName][newIndex].href + '"]:visible').length,
            goToBack = hrefExist || srcExist;

        // If the element does not exists on view, go to the next back img
        if(!goToBack) {

            self.index[collectionName] -= 1;

            return self.back();
        }

        self.goTo(newIndex);
    };

    /**
     * Set image on view container collection
     * @param  {int} newIndex image index to be show
     * @return void
     */
    self.goTo = function(newIndex) {
        // Hide all imgs
        $('.content', self.$EZView).hide();
        
        self.index[collectionName] = newIndex;

        self.returnImageToOriginalMeasures(newIndex);

        if (self.arContent[collectionName][newIndex]) {

            if (self.arContent[collectionName][newIndex].isRender) {

                $('[index-content=' + collectionName + self.index[collectionName]+']').slideUp();

                $('[index-content=' + collectionName + newIndex + ']').slideDown();

            } else {

                $('[index-content=' + collectionName + self.index[collectionName] + ']').slideUp();

                self.setContentOnViewer(self.buildHtmlContent());

                $('[index-content=' + collectionName + newIndex + ']').slideDown();

                self.arContent[collectionName][newIndex].isRender = true;
            }

            self.showOrHideControls();
        }
    };

    /**
     * Open collection with the image thumbnail clicked
     * @param  {object} e event imag thumbnail clicked
     * @return void
     */
    self.runEZView = function(e) {
        var $thumbnail = $(e.target);

        // Set index of collection img
        self.index[collectionName] = parseInt($thumbnail.data('index'));

        self.showOrHideControls();

        // Set img on collection
        self.goTo(self.index[collectionName]);

        // Add keyup events
        $(window).off('keyup', null, self.keyupEvents).keyup(self.keyupEvents);

        // Show EZView
        self.$EZView.show(200);
    };

    // Return constructor execution
    return self.constructor();
};
