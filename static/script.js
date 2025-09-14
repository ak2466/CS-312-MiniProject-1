// Check if content has loaded
        document.addEventListener('DOMContentLoaded', () => {

            // Get make post field
            const makePostField = document.querySelector('.make-post');

            // Get make post button
            const makePostButton = document.querySelector('.make-post-button')

            // Add event listener
            makePostButton.addEventListener('click', () => {

                // Make post field visible
                makePostField.style.display = 'block'
            })

            // Get close button
            const closePostButton = document.querySelector('.close-post-field');

            // Add event listener
            closePostButton.addEventListener('click', () => {
                
                // Make post field invisible
                makePostField.style.display = 'none'
            })


            // Get all delete buttons
            document.querySelectorAll('.delete-button').forEach(button => {
                
                // Add event listener to the button
                button.addEventListener('click', () => {

                    // Get button id
                    const postID = button.getAttribute("post-id")

                    // Fetch delete route from server
                    fetch(`/posts/${postID}`, {
                        method: 'DELETE'
                    })
                    .then(response => {

                        // If response okay
                        if (response.ok) {

                            // Delete the button's parent element (the blog post)
                            button.parentElement.remove();
                        }
                        else {
                            alert("Failed to remove post")
                        }
                    })
                    .catch(error => {
                        console.log(`Error: ${error}`);
                        alert('Error');
                    })
                })
            })

            // Get all edit buttons
            document.querySelectorAll('.edit-button').forEach(button => {
                
                // Add event listener
                button.addEventListener('click', () => {
                    
                    // Get post ID
                    const postID = button.getAttribute("post-id")

                    // Generate a form for the user to edit the blog post with
                    const editForm = document.createElement('form');
                    
                    // Generate HTML for form
                    editForm.innerHTML = `
                    <label for="title"></label><br>
                    <input type="text" id="title" name="title" value=${button.parentElement.querySelector('.title').textContent}><br><br>

                    <label for="content">Content: </label><br>
                    <textarea id="content" name="content">${button.parentElement.querySelector('.content').textContent}</textarea><br><br>

                    <button type="submit">Submit change</button>
                    <button type="button" class="cancel-edit">Cancel</button>
                    `;

                    // Append form to blog post
                    button.parentElement.append(editForm);

                    // Add event listener to the submit button
                    editForm.addEventListener('submit', (event) => {
                        
                        // Prevent reloading of the page (the default)
                        event.preventDefault();

                        // Get the updated title and content from the edit form
                        const newTitle = editForm.querySelector('input[name="title"]').value
                        const newContent = editForm.querySelector('textarea[name="content"]').value

                        // Fetch patch route from server
                        fetch(`/posts/${postID}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            }, 
                            // Convert the body into JSON
                            body: JSON.stringify({
                                title: newTitle,
                                content: newContent
                            })
                        })
                        .then(response => response.json())
                        .then(updatedPost => {

                            // Check if title was changed
                            if(newTitle) {

                                // Change the title immediately
                                button.parentElement.querySelector('h2').textContent = `${newTitle}`;
                            }

                            // Check if content was changed
                            if(newContent) {

                                // Change the content immediately
                                button.parentElement.querySelector('p').textContent = newContent;
                            }

                            // Hide the update form
                            editForm.remove();
                        })

                        // Catch errors
                        .catch(error => {
                            console.log(`Error: ${error}`);
                            alert('Error');
                        })
                    })
                    // Check for cancel button click
                    editForm.querySelector('.cancel-edit').addEventListener('click', () => {

                        // Remove edit form
                        editForm.remove()
                    })
                })
            })
        })