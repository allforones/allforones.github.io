function addListeners(xhr) {
    xhr.addEventListener('error', function(e) {
        console.log('ajax call error')
        swal('Error', `요청이 실패하였습니다. (Error: ${e.target.status})`, 'error');
    });
    xhr.addEventListener('abort', function(e) {
        console.log('ajax call abort')
        swal('Error', `요청이 실패하였습니다. (Error: ${e.target.status})`, 'error');
    });
}

function getAjax(url, success) {
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {        
        if (xhr.readyState > 3 && xhr.status === 200) {
            const data = JSON.parse(xhr.response);
            success(data);
        } else if(xhr.status === 204) {
            success();
        }
    };

    addListeners(xhr);
    
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();    
    return xhr;
}

function getCORS(url, success, fail) {
    let xhr = new XMLHttpRequest();
    if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.send();
    return xhr;
}

function postAjax(url, data, success, error) {
    // data 형식이 'p1=1&p2=Hello+World' 이와 비슷할 경우
    const params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');
    
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status === 200) { success(xhr.responseText); }
    };

    addListeners(xhr);
    
    xhr.onerror = error ? error : function() {swal('Error', `요청이 실패하였습니다. (Error: ${xhr.status})`, 'error');}
    
    if(typeof data === 'string') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8;');
    } else {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(params);
    return xhr;
}

function putAjax(url, data, success, error) {
    if(typeof data !== 'string') {
        const params = Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');
        url += "?" + params;
    }
    
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");   
    xhr.open('PUT', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status === 200) { success(xhr.responseText); }
        if(xhr.status >= 400 && error) {error()};
    };

    addListeners(xhr);

    if(typeof data == 'string') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8;');
        xhr.send(data);
    } else {        
        xhr.send();
    }
    return xhr;
}

function patchAjax(url, data, success, error) {
    if(typeof data !== 'string') {
        const params = Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');
        url += "?" + params;
    }

    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('PATCH', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status === 200) { success(xhr.responseText); }
        if(xhr.status >= 400 && error) {error()};
    };

    addListeners(xhr);
    xhr.send();
    return xhr;
}

function deleteAjax(url, success) {
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('DELETE', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status === 200) {
            const data = xhr.response ? JSON.parse(xhr.response) : '';
            success(data);
        }
    };

    addListeners(xhr);
    
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function serialize(form) {
    var field, l, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (var i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    l = form.elements[i].options.length;
                    for (var j=0; j<l; j++) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }
    return s.join('&').replace(/%20/g, '+');
}

function serializeArray(form) {
    var field, l, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (var i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    l = form.elements[i].options.length;
                    for (j=0; j<l; j++) {
                        if(field.options[j].selected)
                            s[s.length] = { name: field.name, value: field.options[j].value };
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = { name: field.name, value: field.value };
                }
            }
        }
    }
    return s;
}