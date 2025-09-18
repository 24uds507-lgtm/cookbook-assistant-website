document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = 'API_KEY';

    const recipeContainer = document.getElementById('recipe-container');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const pantryInput = document.getElementById('pantryInput');
    const pantryBtn = document.getElementById('pantryBtn');
    const modal = document.getElementById('recipe-modal');
    const closeModalBtn = document.querySelector('.close-button');


    const fetchRecipes = async (query) => {
        recipeContainer.innerHTML = '<p class="loading">Fetching recipes...</p>';
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            displayRecipes(data.results);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeContainer.innerHTML = '<p class="error">Sorry, we couldn\'t fetch recipes. Please try again later.</p>';
        }
    };
    

    const displayRecipes = (recipes) => {
        recipeContainer.innerHTML = '';
        if (recipes.length === 0) {
            recipeContainer.innerHTML = '<p>No recipes found. Try a different search!</p>';
            return;
        }
        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.dataset.id = recipe.id;

            card.innerHTML = `
                <div class="recipe-image-container">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                </div>
            `;
            recipeContainer.appendChild(card);
        });
    };
    
    const fetchRecipeDetails = async (id) => {
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            openModal(data);
        } catch (error) {
            console.error("Error fetching recipe details:", error);
            alert("Could not fetch recipe details.");
        }
    };
    
const openModal = (recipe) => {
    document.getElementById('modal-img').src = recipe.image;
    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-ingredients').innerHTML = recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('');
    document.getElementById('modal-instructions').innerHTML = recipe.instructions || recipe.summary;
    

    modal.classList.add('active'); 
};

const closeModal = () => {

    modal.classList.remove('active');
}

    const performSearch = () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) fetchRecipes(searchTerm);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    pantryBtn.addEventListener('click', () => {
        const ingredients = pantryInput.value.trim();
        if(ingredients) {
            const ingredientsQuery = ingredients.split(',').map(item => item.trim()).join(',');
            const pantryUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsQuery}&number=12&apiKey=${API_KEY}`;
            fetch(pantryUrl).then(res => res.json()).then(data => displayRecipes(data));
        }
    });

    recipeContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.recipe-card');
        if (card && card.dataset.id) fetchRecipeDetails(card.dataset.id);
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    fetchRecipes('pasta'); 
});