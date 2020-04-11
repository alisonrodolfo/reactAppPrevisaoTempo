import React from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";

import axios from "axios";

import * as Permissions from "expo-permissions";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class AddEditCidade extends React.Component {
  state = {
    name: "",
    temperatura: 0,
    probchuva: 0,
    humidade: 0,
    description: "",
    icon: "",
    sensacao: 0,
    nascersol: "",
    pordosol: "",
    isLoading: true,
    setLoading: true,
    vento: 0,
    previsao: [],
    revisao: true,
    criandoConta: false,
  };

  UNSAFE_componentWillMount() {
    if (this.props.navigation.state.params.newAccount) {
      this._synconta();
      this.props.navigation.setParams({
        newAccount: false,
        editCidade: false
      });
      this.props.navigation.navigate("Cidades", {
        newAccount: false,
        editCidade: false
      });
    }

    this.props.navigation.setParams({
      onSave: this.save,
      onDeletePress: this.del,
    });
    const item = this.props.navigation.state.params.item;
    if (item) {
      this.setState({
        name: item.name,
      });
      this.currentTodo = item;
    }
  }

  _synconta = async () => {
    const token = await this.createAccount();
    this.setState({ criandoConta: false });
  };

  createAccount = () => {
    const cidade1 = {
      name: "Barcelona",
    };
    this.props.add(cidade1);
    const cidade2 = {
      name: "Dublin",
    };
    this.props.add(cidade2);
    const cidade3 = {
      name: "London",
    };
    this.props.add(cidade3);
    const cidade4 = {
      name: "New York",
    };
    this.props.add(cidade4);

    this.storage();
  };

  componentDidMount() {
    if (this.props.navigation.state.params.editCidade) {
      axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            this.state.name +
            "&lang=pt_br&units=metric&APPID=31f835fafe8e52b246f01ab96effeab4"
        )
        .then((response) => {
          this.setState({
            temperatura: Math.round(response.data.main.temp),
            probchuva: Math.round(response.data.clouds.all),
            humidade: Math.round(response.data.main.humidity),
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            sensacao: Math.round(response.data.main.feels_like),
            nascersol: response.data.sys.sunrise,
            pordosol: response.data.sys.sunset,
            vento: Math.round(response.data.wind.speed * 3.6),
          });
        })
        .catch((error) => console.error(error))
        .finally(() => this.setState({ isLoading: false }));

      axios
        .get(
          "https://api.openweathermap.org/data/2.5/forecast?q=" +
            this.state.name +
            "&lang=pt_br&units=metric&APPID=31f835fafe8e52b246f01ab96effeab4"
        )
        .then((response) => {
          this.setState({
            previsao: response.data.list,
          });
        })
        .catch((error) => console.error(error))
        .finally(() => this.setState({ setLoading: false }));
    }
  }

  changeDate = (date) => {
    this.setState({ date: date });
  };

  storage = () => {
    setTimeout(
      () => AsyncStorage.setItem("cidade", JSON.stringify(this.props.cidades)),
      500
    );
  };

  del = () => {
    this.props.del(this.props.navigation.state.params.item.key);
    this.props.navigation.goBack(null);
  };

  save = () => {
    if (this.state.name === "") return;
    if (this.currentTodo) {
      const updatedTodo = {
        key: this.currentTodo.key,
        name: this.state.name,
      };
      this.props.update(updatedTodo);
    } else {
      const newTodo = {
        name: this.state.name,
      };
      this.props.add(newTodo);
    }
    this.storage();
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View>
        <TextInput
          autofocus
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
          style={{
            height: 50,
            backgroundColor: "white",
            padding: 5,
            marginTop: 25,
          }}
          placeholder="Name of the item"
          placeholderTextColor="gray"
        />

        {this.state.isLoading || !this.currentTodo ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={styles.brazil_forecast_cities__city}>
            <View style={styles.brazil_forecast_cities__city_cont}>
              <View>
                <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
                  {this.state.name}
                </Text>
                <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
                  Temp: {this.state.temperatura}º
                </Text>
              </View>
              <View>
                <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
                  Probalidade de chuva: {this.state.probchuva}%
                </Text>
                <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
                  Sensação termica: {this.state.sensacao}º
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 0,
                  marginLeft: 0,
                  height: 50,
                  width: 50,
                }}
              >
                <MaterialCommunityIcons name="pencil" size={20} />
              </View>
            </View>
            <Text style={{ fontSize: 15 }}>
              Previsão para os proximos 5 dias
            </Text>
          </View>
        )}
        <SafeAreaView>
          {this.state.setLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={this.state.previsao}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }
}

AddEditCidade.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.headerTitle,
  headerRight: (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={navigation.state.params.onSave}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>OK</Text>
      </TouchableOpacity>
      {navigation.state.params.item ? (
        <TouchableOpacity onPress={navigation.state.params.onDeletePress}>
          <Text style={{ fontSize: 20, marginRight: 5 }}>DEL</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  ),
});

const styles = StyleSheet.create({
  brazil_forecast_cities__city: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#ddd",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 2,
    padding: 2,
    width: "98%",
  },
  brazil_forecast_cities__city_cont: {
    flex: 1,
    flexDirection: "row",
  },
  brazil_forecast_cities__city_cont_img: {
    flex: 1,
    flexDirection: "row",
    //paddingLeft: 20,
  },
});

/*
  const formattedDate = (firstDate) => {
    const formattedDate = format(
      parseISO(new Date(firstDate))), "dd de MMMM, às  HH:mmh");
  };
*/

function Item({ item }) {
  return (
    <View>
      <View style={styles.brazil_forecast_cities__city}>
        <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
          {/* format(new Date(), "dd/MM/yyyy  HH:mm:ss") */}
          Data: {item.dt_txt}
        </Text>
        <View style={styles.brazil_forecast_cities__city_cont}>
          <View>
            <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
              max: {Math.round(item.main.temp_max)}º C
            </Text>
            <Text style={{ paddingLeft: 20, fontSize: 20, flex: 1 }}>
              min: {Math.round(item.main.temp_min)}º C
            </Text>
          </View>
          <View>
            <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
              Chuva: {Math.round(item.clouds.all)}%
            </Text>
            <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
              Temp: {Math.round(item.main.temp)}º C{"\n"}
              Sensação: {Math.round(item.main.feels_like)}º C
            </Text>

            <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
              Humidade: {Math.round(item.main.humidity)}%
            </Text>
            <Text style={{ paddingLeft: 20, fontSize: 15, flex: 3 }}>
              Vento: {Math.round(item.wind.speed)}Km/h
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 0,
              marginLeft: 0,
              height: 50,
              width: 50,
            }}
          ></View>
        </View>
        <View style={styles.brazil_forecast_cities__city_cont_img}>
          <View>
                <Image
                source={{ uri: "http://openweathermap.org/img/wn/" +
                          item.weather[0].icon +
                          "@2x.png" }}
  
                  style={{ width: 100, height: 100 }}
                />
            <Text style={{ fontSize: 20 }}>{item.weather[0].description}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

