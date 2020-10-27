//check off specific items by clicking
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");
});

//click on trash to delete item 
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(500,function(){
        $(this).remove();
    });
    event.stopPropagation();

});

//creates list of items (empty at first)
const clientList = []
const recipeTitleList = []
const recipeDescList = []
const recipeLinkList = []


//press on enter for item to be pushed into clientList and li to be appended to ul 
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        event.preventDefault();

        var ingredientItem = $(this).val();
        //have to push an object where ingredient is the value
        clientList.push(ingredientItem)
        //changes item value to string
        $(this).val("");
        //create a new li and add to ul
        $("ul").append("<li class='newItem' name='ingredient'><span class='spanIcon'><i class='fas fa-trash'></i></span> " + ingredientItem + "</li>")
    }
});

//click on span icon next to Recipe generator for hiding of input field
$("#toggle-form").click(function(){
    $("input[type='text']").fadeToggle();
});

//click on id submitButton for id newIngredient to get a value equal to the items in clientList
$("#submitButton").click(function(){
    var ingredientInput = document.getElementById("newIngredient")
    ingredientInput.value = clientList
    console.log(ingredientInput)    
})

$("#ingredientSubmit").click(function(){
    const title = document.getElementById("recipeTitle").textContent;
    const desc = document.getElementById("recipeDescription").textContent;
    const link = document.getElementById("recipeLink");
    recipeTitleList.push(title)
    recipeDescList.push(desc)
    recipeLinkList.push(link)
    const userRecipeTitle = document.getElementById("recipeTitleInput")
    const userRecipeDescription = document.getElementById("recipeDescriptionInput")
    const userRecipeLink = document.getElementById("recipeLinkInput")
    userRecipeTitle.value = recipeTitleList
    userRecipeDescription.value = recipeDescList
    userRecipeLink.value = recipeLinkList

})

