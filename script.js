//Define a variável modalQt como 1
let modalQt = 1;

//Define uma função c que seleciona um elemento no DOM
const c = (el) => document.querySelector(el);

//Define uma função cs que seleciona vários elementos no DOM
const cs = (el) => document.querySelectorAll(el);

//Itera sobre o array pizzaJson
pizzaJson.map((item, index) => {

    //Clona o modelo de pizza-item do HTML
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Adiciona um atributo data-key com o valor do índice do item em pizzaJson
    pizzaItem.setAttribute('data-key', index);

    //Preenche a imagem da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //Preenche o nome da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    //Preenche a descrição da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Preenche o preço da pizza formatado
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    //Adiciona um event listener ao link da pizza para abrir o modal da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        //Define a variável key como o valor do atributo data-key do elemento pai mais próximo que contém essa propriedade
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //Define a variável modalQt como 1
        modalQt = 1;

        //Preenche a imagem da pizza grande no modal
        c('.pizzaBig img').src = pizzaJson[key].img;

        //Preenche o nome da pizza no modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        //Preenche a descrição da pizza no modal
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        //Preenche o preço da pizza formatado no modal
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //Remove a classe selected da opção de tamanho de pizza previamente selecionada
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //Itera sobre todas as opções de tamanho de pizza e preenche o texto com o tamanho correspondente
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //Define a quantidade de pizzas no modal como 1
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //Torna o modal visível com animação
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //Adiciona a pizza clonada ao final da área de pizzas no HTML
    c('.pizza-area').append(pizzaItem);
});

// Função que fecha o modal
function closeModal() {
    // Altera a opacidade da div que representa o modal para 0
    c('.pizzaWindowArea').style.opacity = 0;
    // Após 500ms, esconde o modal
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// Percorre todos os elementos da página que possuem as classes '.pizzaInfo--cancelButton' ou '.pizzaInfo--cancelMobileButton'
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    // Adiciona um listener para o evento de clique, que chama a função closeModal
    item.addEventListener('click', closeModal);
});

// Listener para o botão de diminuir a quantidade de pizzas selecionadas
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    // Diminui a quantidade selecionada, desde que ela seja maior que 1
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// Listener para o botão de aumentar a quantidade de pizzas selecionadas
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    // Aumenta a quantidade selecionada
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

