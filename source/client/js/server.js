let BASE_URL = location.pathname.replace(/\/$/, ""); // = "http://[host]/VisualBuilder" (no slash)

/**
 * @param {string} url
 * @param {object} data
 * @param {function} callback
 */
function load (url, data, callback) {

    let xhr = new XMLHttpRequest();

    xhr.open(data ? "POST" : "GET", url);
    if (typeof callback === "undefined")
        callback = (data) => console.warn("No callback provided.", data);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = {};
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                console.error(e, url, "Unable to parse:", { data: xhr.responseText });
            }
            return callback(data);
        } else if (xhr.readyState === 4) {
            console.error(url, xhr.responseText + ", " + xhr.status + ": " + xhr.statusText);
            let errs = {};
            try {
                errs = JSON.parse(xhr.responseText);
                errs = (errs[`errors`] || [])[0] || { error: xhr.responseText }; // ought to be rare
            } catch (e) {
                errs = {
                    error: xhr.responseText || `Error ${ xhr.status }`
                };
            }
            return callback(errs);
        }
    };

    xhr.send(data ? JSON.stringify(data) : undefined);

}

/**
 *
 * @param {string} params - URL parameters in the key-value order: ("path", "C:\", "pass", 1111).
 * @returns {string}
 */
function getParams (...params) {
    let url = "",
        first = true;
    params.forEach((p, i, a) => {
        if (i % 2 !== 0 || !p || !a[i+1]) return;
        if (first) { first = false; url += "?" } else { url += "&" }
        url += `${ encodeURIComponent(p) }=${ encodeURIComponent(a[i+1]) }`;
    });
    return url;
}

/**
 * Returns the list of packages and classes on the current level.
 * @param {string} namespace - Namespace to list
 * @param {string} level - Base package name like "Cinema". In this case returns all cinema classes.
 * @param {dataCallback} callback
 */
export function getList (namespace, level, callback) {
    load(
        `${ BASE_URL }/Informer/list${ getParams("ns", namespace, "level", level) }`,
        null,
        callback
    );
}

/**
 * Saves
 * @param {string} namespace
 * @param {*} data - Data like { "Pack.Class": { "properties": { "Pr": { "Description": "Test" }}}}
 * @param {dataCallback} callback
 */
export function save (namespace, data, callback) {
    load(
        `${ BASE_URL }/Editor/save${ getParams("ns", namespace) }`,
        data,
        callback
    )
}

/**
 * Retrieves the basic configuration.
 * @param {dataCallback} callback
 */
export function init (callback) {
    load(`${ BASE_URL }/Informer/init`, null, callback);
}

/**
 * @callback dataCallback
 * @param {*} data - Object that contains server data.
 */