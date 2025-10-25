import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

import { StyleSheet, Text, Button, Modal, View } from "react-native";
// import { Calendar} from 'react-native-calendars';
import { Calendar } from "react-native-calendars";
// import { FlatList } from "react-native/types_generated/index";
import { FlatList, TextInput } from "react-native";

export default function App() {
  const [todo, setTodo] = useState([]);
  const [selectedDate, setselectedDate] = useState();
  const [visible, setVisible] = useState(false);

  const db = SQLite.openDatabaseSync("todos.db"); // Synchronous DB open
  const today = new Date().toISOString().split("T")[0];

  const addTodo = (title, dueDate, status) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (title, dueDate, status) VALUES (?, ?, ?);",
        [title, dueDate, status]
      );
    });
  };
  useEffect(() => {
    try {
      db.execSync(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          dueDate TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Pending',
          timeTaken INTEGER DEFAULT 0
        );`
      );
    } catch (error) {
      console.log("Error creating table", error);
    }
    setTodo([
      {
        id: "1",
        title: "Buy groceries",
        description: "Milk, Bread, Eggs, Butter",
        dueDate: new Date("2025-10-10"),
        status: "Pending",
      },
      {
        id: "2",
        title: "Finish project report",
        description: "Complete the final draft of the project report",
        dueDate: new Date("2025-10-12"),
        status: "In Progress",
      },
      {
        id: "3",
        title: "Workout",
        description: "Go for a 30-minute run",
        dueDate: new Date("2025-10-11"),
        status: "Completed",
      },
    ]);
    // db.runSync(
    //   `INSERT INTO todos (title, description, dueDate, status, timeTaken) VALUES (?, ?, ?, ?, ?);`,

    //   [
    //     "Buy groceries",
    //     "Milk, Bread, Eggs, Butter",
    //     new Date("2025-10-10"),
    //     "Pending",
    //     5,
    //   ]

      //   `INSERT INTO todos SET title = ?, description = ?, dueDate = ?, status = ?, timeTaken = ? ;`,
      //   [  "1",
      //  "Buy groceries",
      //  "Milk, Bread, Eggs, Butter",
      //  new Date("2025-10-10"),
      //  "Pending",]
    // );
    const results = db.getAllSync("SELECT * FROM todos ORDER BY dueDate DESC;");
    console.log(results);
  }, []);

  // const filteredData = selectedDate
  // ? todo.filter(
  //     (item) => item.dueDate.toISOString().split("T")[0] === selectedDate
  //   )
  // : todo;
  const add = ()=>{
    console.log('adding');
    
  }
  const filterdData = selectedDate
    ? todo.filter(
        (item) => item.dueDate.toISOString().split("T")[0] === selectedDate
      )
    : todo;
  return (
    <View style={styles.container}>
      <Calendar
        // onPress={}dateString
        onDayPress={(day) => setselectedDate(day.dateString)}
        // onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: "#6B7280",
          todayTextColor: "#FF2D55",
          dayTextColor: "#111827",
          textDisabledColor: "#D1D5DB",
          monthTextColor: "#111827",
          textMonthFontWeight: "600",
          textDayFontWeight: "400",
        }}
        style={styles.calendar}
      />
      <FlatList
        data={filterdData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>hello </Text>
          </View>
        )}
        ListEmptyComponent={<Text>{"No to-dos found."}</Text>}
      />
      <Button title="Open Modal" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Button title="Close" onPress={() => setVisible(false)} />

            <Text>This is a modal popup!</Text>
            <Text>This is a modal popup!</Text>
            <Text>Title</Text>
            <TextInput placeholder="Title" />
            <Text>desc</Text>
            <TextInput placeholder="Title" textContentType="number" />
             <Text>date</Text>
            <TextInput placeholder="Title" textContentType="number" />
             <Text>time</Text>
            <TextInput placeholder="Title" textContentType="number" />
            <Button onPress={add} title="add"/>
          </View>
        </View>
      </Modal>
      {/* <Modal style={styles.view}
          transparent={false}
      >
        <TextInput placeholder="Title"/>{" "}
        <Text>hello </Text>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#d14545ff",
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0, // Flat calendar
    elevation: 0,
  },
});
