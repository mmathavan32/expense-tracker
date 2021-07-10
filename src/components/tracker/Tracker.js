import React, { Component } from "react";
import fire from "../../config/Fire";
import Transaction from "./transaction/Transaction";

class Tracker extends Component {
  state = {
    transactions: [],
    money: 0,
    transactionName: "",
    transactionType: "",
    price: "",
    currentUID: fire.auth().currentUser.uid,
  };

  logout = () => {
    fire.auth().signOut();
  };

  handleChange = (input) => (e) => {
    this.setState({
      [input]: e.target.value !== "0" ? e.target.value : "",
    });
  };

  addNewTransaction = () => {
    const { transactionName, transactionType, price, currentUID, money } =
      this.state;

    //Validation
    if (transactionName && transactionType && price) {
      const BackUpState = this.state.transactions;
      BackUpState.push({
        id: BackUpState.length + 1,
        name: transactionName,
        type: transactionType,
        price: price,
        user_id: currentUID,
      });
      console.log(BackUpState);

      fire
        .database()
        .ref("Transactions/" + currentUID)
        .push({
          id: BackUpState.length,
          name: transactionName,
          type: transactionType,
          price: price,
          user_id: currentUID,
        })
        .then((data) => {
          console.log("successs");
          this.setState({
            transactions: BackUpState,
            money:
              transactionType === "deposit"
                ? money + parseFloat(price)
                : money - parseFloat(price),
            transactionName: "",
            transactionType: "",
            price: "",
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  componentWillMount() {
    const { currentUID, money } = this.state;
    let totalMoney = money;
    const BackUpState = this.state.transactions;
    fire
      .database()
      .ref("Transactions/" + currentUID)
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          totalMoney =
            childSnapshot.val().type === "deposit"
              ? totalMoney + parseFloat(childSnapshot.val().price)
              : totalMoney - parseFloat(childSnapshot.val().price);

          BackUpState.push({
            id: childSnapshot.val().id,
            name: childSnapshot.val().name,
            type: childSnapshot.val().type,
            price: childSnapshot.val().price,
            user_id: childSnapshot.val().user_id,
          });
        });

        this.setState({
          transactions: BackUpState,
          money: totalMoney,
        });
      });
  }

  render() {
    let currentUser = fire.auth().currentUser;
    return (
      <div className="tracker-block">
        <div className="top-container">
          <div className="welcome">
            <span>Hi, {currentUser.displayName}!</span>
            <button className="logoutBtn" onClick={this.logout}>
              Logout
            </button>
          </div>
          <div className="total-money">₹{this.state.money}</div>
          <div className="new-transaction-block">
            <div className="new-transaction">
              <form>
                <input
                  placeholder="Transaction Name (ex. ATM, Purchase)"
                  type="text"
                  name="transactionName"
                  value={this.state.transactionName}
                  onChange={this.handleChange("transactionName")}
                />
                <div className="input-group">
                  <select
                    name="type"
                    value={this.state.transactionType}
                    onChange={this.handleChange("transactionType")}
                  >
                    <option value="0">Type</option>
                    <option value="deposit">Deposit</option>
                    <option value="expense">Expense</option>
                  </select>
                  <input
                    placeholder="Price"
                    type="number"
                    min="1"
                    name="price"
                    value={this.state.price}
                    onChange={this.handleChange("price")}
                  />
                </div>
              </form>
              <button
                className="add-transaction"
                onClick={() => this.addNewTransaction()}
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
        <div className="latest-transactions">
          <p>Latest Transactions</p>
          <ul>
            {Object.keys(this.state.transactions).map((id) => (
              <Transaction
                key={id}
                type={this.state.transactions[id].type}
                name={this.state.transactions[id].name}
                price={this.state.transactions[id].price}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Tracker;
