// adapted from https://www.aleksandrhovhannisyan.com/blog/how-to-add-a-copy-to-clipboard-button-to-your-jekyll-blog/
// and https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/

const codeBlocks = document.querySelectorAll("pre > code");

codeBlocks.forEach((codeBlock) => {

  // TODO display the auto-detected hljs langauge as well
  // create the "header" div
  let placeholder = document.createElement('div');
  placeholder.innerHTML = '<div class="code-block-header"><button class="copy-code-block-button" aria-label="Copy code to clipboard"></button><div>';
  let buttonContainer = placeholder.firstElementChild;

  // insert the button container before the enclosing <pre>
  let pre = codeBlock.parentNode;
  pre.parentNode.insertBefore(buttonContainer, pre);
  // also get rid of the top margin - the buttonContainer does that job now
  pre.style = "margin-top: 0;"

  let button = buttonContainer.firstChild;

  button.addEventListener('click', () => {
    window.navigator.clipboard.writeText(codeBlock.innerText);
    button.classList.add('copied');

    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  });
});
