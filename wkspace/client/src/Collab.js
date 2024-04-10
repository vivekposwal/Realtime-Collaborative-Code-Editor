import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
function getEl(id) {
  return document.getElementById('editor');
}
const Collab = () => {
  useEffect(() => {
    var socket = io('http://localhost:3000');

    const editor = getEl('editor');
    if (editor) {
      editor.addEventListener('keyup', (evt) => {
        const text = editor.value;
        socket.send(text);
      });
    }

    socket.on('message', (data) => {
      editor.value = data;
    });
  }, []);

  return (
    <div>
      <textarea id="editor"></textarea>
    </div>
  );
};

export default Collab;
