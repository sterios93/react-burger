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
  }

  removeIngredientHandler = (type) => {
  }

  render() {
    return (
      <Aux>
          <Burger ingredients = { this.state.ingredients } />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
          />
      </Aux>
    );
  }
}

export default BurgerBuilder;