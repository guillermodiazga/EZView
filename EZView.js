"use strict";
/*
 * jQuery plugin to show images and pdf files preview
 * https://github.com/guillermodiazga/EZView
 *
 * Copyright 2017, Guillermo Diaz
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */
var $ = jQuery;

if (!$) {
    window.console.error('jQuery is requiered');
}

$.fn.EZView = function() {
    var self             = this,
        $EZView          = null,
        iFramesSupported = true,
        arIndex          = [],
        index            = 0,
        icons            = {
            'next'     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA1OUQzQkZEMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1OUQzQkZDMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po6G6sQAAAB/SURBVHjaYvj//z8DDANBARALIIvhw8gaFwAxiHGBWAPQNf4nxQBsGok2gAGq6D85BoCAALkGwEwgywBkJ5BsALofSDIAWyAQbQCuUCTKACYGSgDVnE12gJEdVWQnEoqSJyUZgwmqABu4CMQOQEUf8EYV2YUBxcUQuQUgQIABAENaIhLMSm8LAAAAAElFTkSuQmCC',
            'back'     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA1OUQzQzAxMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1OUQzQzAwMDZBODExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjJSsWEAAAB3SURBVHjaYvj//z8DMRgIBIC4AEWMBI0XgBjEWUC0ZjSN/5ENIEcj3AByNf4Hy5GtEaSGXI0YfiZFI4pmUjXCNZOjEaqPPI0gzMRACaDI2RQHGMVRRXEioTh5kmIAE55Y+ACkHID4Ig4lF2hXGFBcDOErAAECDAApfSISSEStFwAAAABJRU5ErkJggg==',
            'download' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM2MDhDRDE0MDY5RDExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM2MDhDRDEzMDY5RDExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqrnV/wAAACxSURBVHjaYvz//z8DIcDIyPgBSPGjiwP1MhLUS6QFWBURYwETA43BqAWjFgwBC0CZBQUDASjX/icTf0A3D5sPHID4I5nuDSDoA6gvEshwfQJWs7AJkmHJBJzm4JKAWrKACMMX4DUDnyTUkg14DL8AxAKUWiAANQjd8AeEDCfKAiRLkJMviG1AlF5iFEEtMUCyxIFYfYxQTfw0yscfGaEuGjplEaieRq6rh54P0AFAgAEAR8yvtAJdObEAAAAASUVORK5CYII=',
            'zoomin'   : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg5MkI5ODJFMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MkI5ODJEMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtK4jPoAAAFgSURBVHjarFZRccMwDLVz+58hlMHKYIYQCIUQCINQCBmDQMgYdAwMwUPgWYtyp2lSZa/R3bsktqwXyfJLfCnFSea9j/UyVpzZVKpY6rrFtRqQUGDQFaYMANnI10vgBJeG4BxzM8kdAsjqDQElyr1EO0EUFkLAk1DOgITcf7JI+B5czBJsTUHXQIZB8f2TxSI4QYAsjE8t2YBdmaNUorI1ohgg0f2TfAZ2Dj7qYHJ9Rs/Lq+QwsOeVHMZcUQBkrCCytEazwT1u2XJ4Ys9nogSBZoBjXogRWzKhexBrwNCZyUjuPzUSunHP2JbcvhBcRIHgRWmC3wLJ2rC0CB+WNlvtT0/82CUTmz8nWFsEclbk/IpBI2rWrVeR+RvO/5B6k8gpepQbA64tRFrNA5JJQW5YtpOR/XyXpBcW0SEkBtF0hHbt5w0+3+/CVDosEyWjny+s1/67HrEqN9A0af83+xZgABRpKnOx6YemAAAAAElFTkSuQmCC',
            'zoomout'  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg5MkI5ODMyMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MkI5ODMxMDZBQjExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqDoPeEAAAFMSURBVHjarJUBkYQwDEUpCioBB4eDq4SVUAknAQlIQMJKQALrgHPQVcAmO2Unl0loepCZPwy06WvSkLpt2xrJnHMRHgHUsaEFNIHf0lgNIVRgN9CKQwXNoJ77S+KAybA4VzRDFEAC3UFD1vwf0A4YBEf85oV0dhnM56upQ/N5x3T3xVyDjfyMjiA8ih/LYWbnuyWavST3SasVQFL3J8XSvBYGvkhFT02FwQJY6g/yKUjzWvY+k58xgTZFSfLRrG3OW6qF9CQVWL5OkS+liEN+yfutJgRIG8K+WV8Tjdd7qKguk69UhpjjzgCIzG8ttZVRAIUDgNiGShDPfspdS14w5PMaC9dALHVhDXS69fM0eCF1mtLBpqIKYT1pVBaZ86H7QvTxEFLZJIug0xADqL+idyEo5Qp8sKHn++yuiESJ6HPDXgohoIHeki8BBgDP751LFBCcbgAAAABJRU5ErkJggg==',
            'close'    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdGODJCNTUzMDZBMzExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdGODJCNTUyMDZBMzExRTI5OUZEQTZGODg4RDc1ODdCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODA4M0ZFMkJBM0M1RUU2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0U3NkRBMDNEMDVDMSIvPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPmdseXBoaWNvbnM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PshQd58AAAB+SURBVHjarJTdCcAgDIRDJ3AU95+io7hBmkAsFuWSwgn3oudnflRRVbHRTcN0m5rPIbknvL6nx9wL0RCELZDpH8H4QCDsAFlhx4UNBiDTmxpayVM8LY1aiqHnqReLmTZDfnQGdvQS1qCnRik2pf20C8l8IrRHy/lGWB/bI8AA4oOVMKhFFb8AAAAASUVORK5CYII=',
        };
    
    // Destroy container
    $('#EZView').remove();
    arIndex = [];

    self.createContainer = function() {

        if (!$('#EZView').length) {

            var tools = 
                '<div class="tools-container">'+
                    '<spam class="name"><b></b></spam>'+
                    '<spam class="tools">'+
                        '<a class="download EZViewHighlight" download href="">'+
                        '<img src="'+icons.download+'" alt="Download" /></a>'+
                        '<a class="zoomin EZViewHighlight" href="">'+
                        '<img src="'+icons.zoomin+'" alt="Zoomin" /></a>'+
                        '<a class="zoomout EZViewHighlight" href="">'+
                        '<img src="'+icons.zoomout+'" alt="Zoomout" /></a>'+
                    '</spam>'+
                    '<a class="close EZViewHighlight" href="">'+
                    '<img src="'+icons.close+'"/></a>'+
                '</div>',
                container = '<div class="object-container"/>'+
                        '<a class="back EZViewHighlight"><img src="'+icons.back+'" alt="Back" /></a>'+
                        '<a class="next EZViewHighlight"><img src="'+icons.next+'" alt="Next" /></a>'+
                        tools,
                template = '<div id="EZView" class="hide container" style="display: flex; align-items: center; justify-content: center">'+container+'</div>';

            $('body').append(template);

            $EZView = $('#EZView');

            self.addEvents();
        }
    };

    self.isImg = function(imgIndex) {
        return arIndex[imgIndex].isImg;
    };

    self.showOrHideControls = function(imgIndex) {
        var href = arIndex[imgIndex].href,
            name = arIndex[imgIndex].name;

       if (self.isImg(imgIndex)) {
            $('.zoomin, .zoomout').fadeIn(200);
        }else{
            $('.zoomin, .zoomout').fadeOut(200);
        }

        $('.download').attr('href', href);

        $('.name>b').html(name);

        if (imgIndex > 0) {
            $('.back').fadeIn(200);
        }else{
            $('.back').fadeOut(200);
        }
            
        if (imgIndex < arIndex.length-1) {
            $('.next').fadeIn(200);
        }else{
            $('.next').fadeOut(200);
        }
    };

    self.builtObjectTemplate = function(index) {
        var src   = arIndex[index].href,
            isPdf = src.match('.pdf');

        // Content to show 
        var content = '<img index-render="'+index+'" src="'+src+'" class="content" />';
        
        // To show pdf files
        if (isPdf) {
            content = '<iframe frameborder="0" index-render="'+index+'" height="'+$(window).height()*0.95+'" width="'+$(window).width()*0.9+
                '" src="'+src+'" type="application/pdf"><p>Your browser does not support iframes.</p>'+
                '<script type="text/javascript">iFramesSupported = false; alert(iFramesSupported)</script><iframe/>';

            arIndex[index].isImg = false;
        }

        return [content, index];
    };

    /*
     * @param object [content, index]  
     */
    self.setObjectTemplate = function(object) {
        var newIndex    = object[1],
            contentHTML = object[0];
        
        // Append object to body
        $EZView.find('.object-container').append(contentHTML)

         // Stop propagation
        .find('.download, img').click(function(e) {
            // Avoid trigger remove action
            e.stopPropagation();
        });
        
        // Check If href isn't exists and show unsuported msg
        $('[index-render=' + newIndex + ']').on( "error",function() {
            $(this).replaceWith('<h1 index-render="'+index+'" style="padding: 10px; border-radius: 10px; background-color: rgba(255,255,255,0.6)">Unsupported preview</h1>');
            arIndex[index].isImg = false;
        });

        self.setStyles();

        self.showOrHideControls(newIndex);
    };

    self.setStyles = function() {
        // Set Styles
        $EZView.css({
            'background-color': 'rgba(0,0,0,0.5)',
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

        // zoomin
        case 107:
            self.zoom(true);
            break;

        // zoomout
        case 109:
            self.zoom();
            break;
        }
    };

    self.close = function () {
        // Hide EZView elements
        $EZView.hide(200).find('[index-render]').hide();

        // Remove keyup events
        $(window).off('keyup', null, self.keyupEvents);
    };

    self.zoom = function (increment) {
        if (!self.isImg(index)) {
            return;
        }

         var $img   = $('[index-render='+index+']', '#EZView'),
             height = parseInt($img.css('height')),
             width  = parseInt($img.css('width'));

        // Avoid lose imng proportions on zoom in
        $img.css({
            'max-width': '',
            'max-height': '',
        });

        // Enable drag
        if ($.fn.draggable) {
            $img.draggable()
            .css({'cursor': 'move'});
        }

        // Increase or decrease size
        if (increment) {
            height += height * 0.2;
            width  += width * 0.2;
        } else {
            height -= height * 0.2;
            width  -= width * 0.2;
        }

        $img.animate({
            'height': (height)+'px',
            'width': (width)+'px'
        }, 200);
    };

    self.addEvents = function() {

        // Main container
        $EZView

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
        .find('.zoomin, .zoomout, .close').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
        }).end()

        // Add zoomin event
        .find('.zoomin>img').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.zoom(true);
        }).end()

        // Add zoomout event
        .find('.zoomout>img').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.zoom();
        }).end();
    };

    self.next = function() {
        var newIndex = index+1;

        // Check if the element exists
        if(!$('[index='+newIndex+']:visible').length && newIndex < arIndex.length) {
            $('[index-render='+index+']').hide();
            index += 1;
            return self.next();
        }

       self.goTo(newIndex);
    };

    self.back = function() {
        var newIndex = index-1;
        
        // Check if the element exists
        if(!$('[index='+newIndex+']:visible').length  && newIndex > 0) {
            $('[index-render='+index+']').hide();
            index -= 1;
            return self.back();
        }
        
        self.goTo(newIndex);
    };

    self.goTo = function(newIndex) {

        if (arIndex[newIndex]) {

            if (arIndex[newIndex].isRender) {
                $('[index-render='+index+']').slideUp();
                $('[index-render='+newIndex+']').slideDown();
                self.showOrHideControls(newIndex);
            }else{
                $('[index-render='+index+']').slideUp();
                self.setObjectTemplate(self.builtObjectTemplate(newIndex));
                $('[index-render='+newIndex+']').hide().slideDown();
                arIndex[newIndex].isRender = true;
            }

            index = newIndex;
        }
    };

    self.init = function(e) {
        //Create main container if not exists
        self.createContainer();

        index = parseInt($(e.target).attr('index'));
        self.showOrHideControls(index);

        if (arIndex[index].isRender) {
            $('[index-render='+index+']').show();
        }else{
            self.setObjectTemplate(self.builtObjectTemplate(index));
            arIndex[index].isRender = true;
            $('[index-render='+index+']').show();
        }

        // Add keyup events
        $(window).off('keyup', null, self.keyupEvents).keyup(self.keyupEvents);

        // Show EZView
        $EZView.show(200);
    };

    // Constructor
    // Iterate each element and set the click event
    return $(this).each(function(i, el) {
        var $el = $(el);

        // Check if the element exists
        if (!el) {
            return;
        }

        try {
            // Get data requiered to navigate between elements
            arIndex[i]          = [];
            arIndex[i].href     = $el.attr('href') || $el.attr('src');
            arIndex[i].name     = ($.trim($el.html()) && $.trim($el.html()).substring(0,30)) || $el.attr('alt').substring(0,30) || '';
            arIndex[i].isRender = false;
            arIndex[i].isImg    = true;
        } catch(e) {
            console.log(e)
            console.log(el)
        }

        // Set index on each element
        $el.attr('index', i);

        // Add cursor pointer
        $el.css({cursor: 'pointer'});

        // Add events to each elements
        $(this).off().click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            self.init(e);

        });
    });
};

