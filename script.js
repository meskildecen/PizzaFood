let cart = [];
//Define a variável modalQt como 1
let modalQt = 1;
let modalKey = 0;

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
        modalKey = key;

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

// adiciona um listener de eventos de clique para cada botão de tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        // remove a classe "selected" do tamanho da pizza atualmente selecionado
        c('.pizzaInfo--size.selected').classList.remove('selected');
        // adiciona a classe "selected" ao tamanho da pizza clicado
        size.classList.add('selected');
    });
});

// adiciona um listener de eventos de clique para o botão "Adicionar ao carrinho"
c('.pizzaInfo--addButton').addEventListener('click', () => {
    // obtém o tamanho da pizza selecionado
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    // cria um identificador para o item adicionado ao carrinho com o ID da pizza e o tamanho
    let indentifier = pizzaJson[modalKey].id + '@' + size;

    // procura se o item já está no carrinho
    let key = cart.findIndex((item) => item.indentifier == indentifier);

    // se já estiver no carrinho, apenas adiciona a quantidade
    if (key > -1) {
        cart[key].qt += modalQt;
    } 
    // caso contrário, adiciona o item ao carrinho
    else {
        cart.push({
            indentifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    // atualiza o carrinho na interface
    updateCart();

    // fecha o modal
    closeModal();
});

// adiciona um listener de eventos de clique para o botão "Abrir carrinho"
c('.menu-openner').addEventListener('click', ()=>{
    // se o carrinho não estiver vazio, mostra o carrinho
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }    
});

// adiciona um listener de eventos de clique para o botão "Fechar carrinho"
c('.menu-closer').addEventListener('click', ()=>{
    // esconde o carrinho
    c('aside').style.left = '100vw';
});

// define a função para atualizar o carrinho na interface
function updateCart(){

    // atualiza o número de itens do carrinho no botão "Abrir carrinho"
    c('.menu-openner span').innerHTML = cart.length;

    // se o carrinho não estiver vazio, atualiza o subtotal, desconto e total
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // para cada item no carrinho, adiciona um elemento ao carrinho na interface
        for(let i in cart){
            // encontra a pizza correspondente ao ID do item no carrinho
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            // calcula o subtotal
            subtotal += pizzaItem.price * cart[i].qt;

            // clona o modelo de item do carrinho e preenche as informações
            let cartItem = c('.models .cart--item').cloneNode(true);

            // Define o tamanho da pizza com base na escolha do usuário
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            // Define o nome da pizza com base no nome e tamanho escolhidos
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            // Atualiza as informações do item do carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            // Adiciona evento de clique para remover uma unidade do item do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            // Adiciona evento de clique para adicionar uma unidade do item do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            // Adiciona o item do carrinho ao DOM
            c('.cart').append(cartItem);
        }
        // Calcula o desconto e o total da compra
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        // Atualiza os valores exibidos na página
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        // Esconde o carrinho se não houver nenhum item nele
    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};s