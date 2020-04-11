import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import Cidade from "../components/Cidade.js";

export default class Cidades extends React.Component {
  async UNSAFE_componentWillMount() {

    if (this.props.navigation.state.params.newAccount) {
      this.props.navigation.navigate("AddEditCidade", {
        headerTitle: "Criando Conta",
        newAccount: true,
        editCidade: false
      });
    } else {
      this.props.loadFromFirebase();
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _renderRow = ({ item }) => (
    <Cidade
      item={item}
      onToggle={() => this.toggle(item)}
      onEditPress={() => this.edit(item)}
    />
  );

  edit = (item) => {
    this.props.navigation.navigate("AddEditCidade", {
      headerTitle: "Editar Cidade",
      newAccount: false,
      editCidade: true,
      item: item,
      onEndEditing: this.saveEditing,
      onDelete: this.del,
    });
  };

  toggle = (item) => {
    this.props.toggle(item);
    this.storage();
  };

  storage = () => {
    setTimeout(
      () => AsyncStorage.setItem("cidade", JSON.stringify(this.props.cidades)),
      500
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.cidades}
        renderItem={this._renderRow}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}

Cidades.navigationOptions = ({ navigation }) => ({
  title: "Cidades",
  headerRight: (
    <TouchableOpacity
      style={{ marginRight: 20 }}
      onPress={() =>
        navigation.navigate("AddEditCidade", {
          headerTitle: "Add Cidade",
          newAccount: false,
          editCidade: false,
        })
      }
    >
      <Text style={{ fontSize: 30 }}>+</Text>
    </TouchableOpacity>
  ),
});
