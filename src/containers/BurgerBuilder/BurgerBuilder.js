import React , { Component } from 'react';
import Aux from '../../hocs/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
  salad: .5,
  cheese: .4,
  meat: 1.3,
  bacon: .7,
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((result, current) => {
        return result + current;
      }, 0);

    this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updatedIngrediants = {
      ...this.state.ingredients
    }
    updatedIngrediants[type] = updateCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ingredients: updatedIngrediants, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngrediants);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (!oldCount) return;

    const updateCount = oldCount - 1;
    const updatedIngrediants = {
      ...this.state.ingredients
    }
    updatedIngrediants[type] = updateCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ingredients: updatedIngrediants, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngrediants);
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <Aux>
          <Burger ingredients = { this.state.ingredients } />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}/>
      </Aux>
    );
  }
}

export default BurgerBuilder;