//Creating an Interface for CartItems
interface CartItem {
    productId: string;
    quantity: number;
    price: number;
  }
//Interface for Product quantity rules to apply for a particular product  
  interface Rule {
    productId: string;
    apply: (cartItem: CartItem) => number;
  }
//Interface to Apply discount for Buy X and Get Y Discount on a product
  interface buyXGetYDiscount {
    discountId: number,
    itemOnOfferId: string,
    qtyReqd: number,
    itemRewardedId: string,
    qtyRewarded: number,
    priority: number,
  }

  interface bulkDiscount {
    discountId: number,
    itemOnOfferId: string,
    qtyReqd: number,
    discountPercentage: number,
    priority: number
  }
  
  /* Defining a Cart Class and creating functions to add Rules on a Product, Add Items for our Cart,
  Remove product from cart, Remove products by quantity, and to recalculate the final price
  */
  class Cart {
    items: CartItem[] = [];
    rules: Rule[] = [];
    bulkDiscount: bulkDiscount[] = [];
    buyXGetYDiscount: buyXGetYDiscount[] = [];

    addRule(rule: Rule) {
      this.rules.push(rule);
    }
  
    addItem(item: CartItem) {
      this.items.push(item);
      this.recalculate();
    }
  
    removeItem(productId: string) {
      const index = this.items.findIndex(item => item.productId === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
      this.recalculate();
    }

    removeItemQuantity(cartItem: CartItem) {
      const itemObj = this.items.find(item => item.productId === cartItem.productId);
      console.log(`itemObj`, itemObj);
      const index = this.items.findIndex(item => item.productId === cartItem.productId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.items.push({
          ...cartItem,
          quantity: itemObj?.quantity - cartItem.quantity
        })
      }
      this.recalculate();
    }
  
    recalculate() {
      let total = 0;
      for (let item of this.items) {
        const rule = this.rules.find(rule => rule.productId === item.productId);
        console.log(`rulee`, rule);
        if (rule) {
          total += rule.apply(item);
        } else {
          total += item.price * item.quantity;
        }
      }
      console.log(`Total: ${total}`);
    }
  }
  
  const cart = new Cart();
  
  cart.addRule({
    productId: 'buds',
    apply: (cartItem) => {
      if(cartItem.quantity > 2) {
      const effectiveQuantity = Math.ceil(cartItem.quantity / 2);
      return effectiveQuantity * cartItem.price;
      }
      return cartItem.quantity * cartItem.price;
    },
  });
  
  cart.addRule({
    productId: 'op11',
    apply: (cartItem) => {
      if (cartItem.quantity >= 4) {
        return 899.99 * cartItem.quantity;
      } else {
        return cartItem.price * cartItem.quantity;
      }
    },
  });
  
  // cart.addRule({
  //   productId: 'wtch',
  //   apply: (cartItem) => {
  //     const effectiveQuantity = Math.ceil(cartItem.quantity / 3) * 2;
  //     return effectiveQuantity * cartItem.price;
  //   },
  // });
  
  cart.addItem({ productId: 'buds', quantity: 3, price: 129.99 });
  cart.addItem({ productId: 'op11', quantity: 5, price: 949.99 });
  cart.addItem({ productId: 'wtch', quantity: 1, price: 229.99 });
  cart.removeItemQuantity({ productId: 'op11', quantity: 1, price: 949.99 })
  