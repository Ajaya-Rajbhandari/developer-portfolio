import React from 'react';

const Contact = () => {
    return (
        <div>
            <h2>Contact Me</h2>
            <form action='/' method='POST'>
                <div>
                    <label htmlFor='name'>Name:</label>
                    <input type='text' id='name' name='name' required />
                </div>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input type='email' id='email' name='email' required />
                </div>
                <div>
                    <label htmlFor='message'>Message:</label>
                    <textarea id='message' name='message' required></textarea>
                </div>
                <button type='submit'>Send Message</button>
            </form>
            <h3>Connect with me on:</h3>
            <ul>
                <li><a href='https://github.com/your-username'>GitHub</a></li>
                <li><a href='https://linkedin.com/in/your-linkedin'>LinkedIn</a></li>
                <li><a href='https://twitter.com/your-twitter'>Twitter</a></li>
            </ul>
        </div>
    );
};

export default Contact;