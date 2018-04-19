export const block_comment = [
    `%{ evaluate_this = false; % Evaluated as regular single-line comment
evaluate_this = true;
%}

evaluate_this = true;

%{
This is a multi-line comment
evaluate_this = false;
%{
%}

evaluate_this = true;

%{
Opening (%{) and closing (%}) block comment markers can be within a comment block
%}

evaluate_this = true;

    %{
    Indented block comments can be indented
or not
and whitespace can be added before or after the %{ and %}
  %}   

evaluate_this = true;`,
    `<span class="hljs-comment">%{ evaluate_this = false; % Evaluated as regular single-line comment</span>
evaluate_this = true;
<span class="hljs-comment">%}</span>

evaluate_this = true;
<span class="hljs-comment">
%{
This is a multi-line comment
evaluate_this = false;
%{
%}
</span>
evaluate_this = true;
<span class="hljs-comment">
%{
Opening (%{) and closing (%}) block comment markers can be within a comment block
%}
</span>
evaluate_this = true;
<span class="hljs-comment">
    %{
    Indented block comments can be indented
or not
and whitespace can be added before or after the %{ and %}
  %}   
</span>
evaluate_this = true;`
];