async function GetComments() {
    $.ajax({
        url: `${window.serverApiUrl}/comments/`,
        method: "GET", 
        success: function(response) {
            result = response;
            // fill list of comments
            createListOfComments(result);
        }
    });
}

async function CreateComment(comment) {
    $.ajax({        
        url: `${window.serverApiUrl}/comments/`,
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(comment),
        success: function() {   
            GetComments();         
        }
    });
}

function createListOfComments(comments){
    const ul = document.getElementsByClassName('comment_list')[0];

    comments.forEach(element => {
        if (element.parentId == 0){
            const li = document.createElement('li');
            li.setAttribute('id', 'li_'+element.id);

            const liCheck = document.getElementById('li_' + element.id);
            if (liCheck == null){
                li.innerHTML = element.text + ': '+ element.userName + ', '+ element.date;
                ul.appendChild(li);
            }
            
        }
        else
        {
            const parentLi = document.getElementById('li_' + element.parentId);
            
            const parentUl = document.createElement('ul');
            parentUl.setAttribute('id', 'ul_'+element.parentId);

            const ulCheck = document.getElementById('ul_' + element.parentId);
            if (ulCheck == null){
                const li = document.createElement('li');
                li.setAttribute('id', 'li_'+element.id);
                const liCheck = document.getElementById('li_' + element.id);
                if (liCheck == null){
                    li.innerHTML = element.text + ': '+ element.userName + ', '+ element.date;
                    parentLi.appendChild(parentUl);
                    parentUl.appendChild(li);
                }              
            }

        }
    });

}

function validation(comment) {

    if (comment.date == "") {
        return false;
    }
    if (comment.userName == "") {
        return false;
    }
    if (comment.text == "") {
        return false;
    }
    return true;
}

(async function () {
    document.getElementById("send_btn").addEventListener("click", function() {
        const userName = document.getElementById("user_name_input").value;
        const text = document.getElementById("text_input").value;

        let comment = {};
        comment.id = 0;
        comment.date = new Date();
        comment.userName = userName;
        comment.text = text;

        const isValid = validation(comment);

        if (!isValid) {
            alert("Validation error. All fields must be filled.");
            return;
        }

        CreateComment(comment);
    });

    
    await GetComments();

})()