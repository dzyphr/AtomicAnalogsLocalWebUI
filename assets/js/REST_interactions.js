function localClientPostJSON(data)
{
        url = "http://localhost:3031/v0.0.1/requests"
        const headers = {
                Authorization: "Bearer " + "PASSWORD",
                "Content-Type": "application/json"
        }
        console.log(data);
        return fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
        }).then(async res  =>
                {
                         return await res.text();
                });
}

function postJSONgetText(url, data)
{
        const headers = {
                Authorization: "Bearer " + "NONE",
                "Content-Type": "application/json"
        }
        return fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
        }).then(async res  =>
                {
                         return await res.text();
                });
}


function postJSON(url, data)
{
        const headers = {
                Authorization: "Bearer " + "NONE",
                "Content-Type": "application/json"
        }
        return fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
        }).then(async res  =>
                {
                         return await res.json();
                });
}

function getJSON(url)
{
        const authHeaders = {
                Authorization: "Bearer " + "NONE",
        };
        return fetch(url, {
                method: "GET",
        }).then((res) => res.text()).then((textres) => JSON.parse(textres)).then((json) => json)
}

