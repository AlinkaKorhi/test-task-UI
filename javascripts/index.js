var parentReplyIdClick = 0;

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

function isExistsChild(comments, chekParentId){
   
    let check = false;
    comments.forEach(element => {
        if( element.parentId == chekParentId){
            check = true;
        }
    });

    return check;
}

function createListOfComments(comments){

    const MainUl = document.getElementsByClassName('comment_list')[0];
    $('.comment_list').empty();
    comments.sort((a, b) => (a.parentId > b.parentId) ? 1 : -1)

    // male list of comments: if element have children --> ul else --> li

    comments.forEach(element => {

        const li = document.createElement('li');        
        li.setAttribute('id', 'li_'+element.id);
        const liCheck = document.getElementById('li_' + element.id);

        if (liCheck == null){

            li.innerHTML = element.text + ': '+ element.userName + ', '+ element.date + ' <button type="submit" onclick="replyShow('+ element.id +')">Reply</button>';
            if (element.parentId == 0){

                MainUl.appendChild(li);

            } else{

                const ParentUl = document.getElementById('ul_' + element.parentId);
                ParentUl.appendChild(li);

            }
        }

        if (isExistsChild(comments, element.id)){
            const ul = document.createElement('ul');
            ul.setAttribute('id', 'ul_'+element.id);

            const ulCheck = document.getElementById('ul_' + element.id);
            if (ulCheck == null){
                li.appendChild(ul);
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

function replyShow(parentReplyId){

    document.getElementById("user_name_input").value = "";
    document.getElementById("text_input").value = "";
    $(".comment_container").hide();
    $("div").removeClass("hide_style");
    $(".reply_container").show();
    document.getElementById("user_name_input_reply").value = "";
    document.getElementById("text_input_reply").value = "";
    parentReplyIdClick = parentReplyId;
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
        document.getElementById("user_name_input").value = "";
        document.getElementById("text_input").value = "";
    });

    document.getElementById("reply_btn").addEventListener("click", function() {
        const userName = document.getElementById("user_name_input_reply").value;
        const text = document.getElementById("text_input_reply").value;

        let comment = {};
        comment.id = 0;
        comment.parentId = parentReplyIdClick;
        comment.date = new Date();
        comment.userName = userName;
        comment.text = text;

        const isValid = validation(comment);

        if (!isValid) {
            alert("Validation error. All fields must be filled.");
            return;
        }

        CreateComment(comment);
        
        $(".comment_container").show();

        const reply_container = document.getElementsByClassName('reply_container')[0];
        reply_container.classList.add("hide_style");
        $(".rely_container").hide();
    });

    document.getElementById("cancel_reply_btn").addEventListener("click", function() {
               
        $(".comment_container").show();

        const reply_container = document.getElementsByClassName('reply_container')[0];
        reply_container.classList.add("hide_style");
        $(".rely_container").hide();
    });
    
    await GetComments();
})()


