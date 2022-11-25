import { formatDate } from '/js/date-formatting.js';
import { url } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML item display template that is used when getItems is called
export class HTML {
    insertHTML(data) {
        // title
        let linkTitle = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        linkTitle = url + '/?' + data.type + '=' + linkTitle;

        let pollList = '';

        data.options.forEach((item, i) => {
            pollList += '<li><input id="' + data.id + '-option-' + i + '" type="radio" name="post-' + data.id + '-options" value="' + i + '"/> <label for="' + data.id + '-option-' + i + '">' + item + '</label></li>';
        });
        pollList = '<ol>' + pollList + '</ol>';


        // tags
        const tags = data.tags.split(" ");
        let tagsString = '';
        tags.forEach(item => {
            tagsString += '<a class="tag ' + data.type + '" href="' + url + '/?tag=' + item + '">#' + item + '</a>';
        });

        // votes and voting
        // let buttonsContainer = '';

        // if (data.votes.length === 2) {
        //     buttonsContainer = `
        //         <div class="flex-column"><span>${data.votes[0]}</span><input id="for" type="button" value="For"/></div>
        //         <div class="flex-column"><span>${data.votes[1]}</span><input id="against" type="button" value="Against"/></div>
        //         `;
        // } else {
        //     data.votes.forEach((item, index) => {
        //         buttonsContainer += `
        //         <div class="flex-column" style="height: `+ item * 23 + `px; max-height: 200px"><span>${item}</span><input id="for" type="button" value="${index + 1}"/></div>`;
        //     });
        // }

        return `
        <article class="item" id="post-${data.id}">
            <div class="flex">
                <div class="flex justify-start">
                    <a class="main-image" href="${linkTitle}" target="_blank"><img class="image" src="/img/love-technology.jpg" alt="${data.title}" /></a>

                    <div class="content">
                        <div class="user_info">
                            <span class="${data.type} item-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + `</span>
                            <span id="countdown"> | <img class="clock" src="/svgs/clock.svg" alt="clock" />`+ countdown(data.date) + ` d:h</span>
                            <span class="actions">
                                <button id="${data.title}" class="delete"></button>
                            </span>
                        </div>
                        <a class="title ${data.type}" href="${linkTitle}"><h2>${data.title}</h2></a>
                        <div class="description"><p>${data.description}</p> ${pollList}</div>
                        <div class="tags ${data.type}"><b>Tags:</b> ${tagsString}</div>
                    </div>
                </div>
                <div class="voting" id="voting"><button id="vote-for-post-` + data.id + `" class="vote-btn ${data.type}-bg">Vote</button><canvas class="myChart"></canvas></div>
            </div>
        </article>
        `;
    }
}