export class Request {
    constructor(baseUrl) {
        this.baseUrl = baseUrl

    }

    // callback
    get(url = this.baseUrl, onSuccess, onError, headers = {}) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);

        for(let key in headers) {
            xhr.setRequestHeader(key, headers[key])
        }
        
        xhr.send();

        const stateChangeHandler = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    onError(xhr.status, xhr.responseText);
                }

                onSuccess(xhr.response);
            }
        }

        xhr.addEventListener('readystatechange', stateChangeHandler);
    }

    post(url = this.baseUrl, data, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);

        const stateChangeHandler = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    onError(xhr.status, xhr.responseText);
                }
                onSuccess(xhr.response);
            }
        };

        xhr.addEventListener('readystatechange', stateChangeHandler);
    }

    delete(url = this.baseUrl, id, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${url}/${id}`);
        xhr.send();

        const stateChangeHandler = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    onError(xhr.status, xhr.responseText);
                }
                onSuccess();
            }
        };

        xhr.addEventListener('readystatechange', stateChangeHandler);
    }
}