async function GetComments() {
    $.ajax({
        url: `${window.serverApiUrl}/comments/`,
        success: function(response) {
            result = response;
            // fill list of comments
            createListOfComments(result);
        }
    });
}

function createListOfComments(comments){
    const ul = document.getElementsByClassName('comment_list')[0];

    comments.forEach(element => {
        if (element.parentId == 0){
            const li = document.createElement('li');
            li.setAttribute('id', 'li_'+element.id);
            li.innerHTML = element.text + ': '+ element.userName + ', '+ element.date;
            ul.appendChild(li);
        }
        else
        {
            const parentLi = document.getElementById('li_' + element.parentId);
            
            const parentUl = document.createElement('ul');
            parentUl.setAttribute('id', 'ul_'+element.parentId);
            const li = document.createElement('li');
            li.setAttribute('id', 'li_'+element.id);
            li.innerHTML = element.text + ': '+ element.userName + ', '+ element.date;
            parentLi.appendChild(parentUl);
            parentUl.appendChild(li);
        }
    });

}

(async function () {
    await GetComments();
})()