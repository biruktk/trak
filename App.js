import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

import { StyleSheet, Text, Button, Modal, View } from "react-native";
// import { Calendar} from 'react-native-calendars';
import { Calendar } from "react-native-calendars";
// import { FlatList } from "react-native/types_generated/index";
import { FlatList, TextInput } from "react-native";
import CustomDay from "./components/CustomDay";
export default function App() {
  // const [selectedDate, setSelectedDate] = useState('');
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

    // pray, sleep, workout
    // none negotables
    // on click on the date it wil be added to the todo
    // color for dates in recatangel looking
    // - [ ] Color code days: red (<50%), yellow (90%), green (>100%)
    //

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
    // console.log(results);
  }, []);

  // const filteredData = selectedDate
  // ? todo.filter(
  //     (item) => item.dueDate.toISOString().split("T")[0] === selectedDate
  //   )
  // : todo;
  const add = () => {
    console.log("adding");
  };
  const filterdData = selectedDate
    ? todo.filter(
        (item) => item.dueDate.toISOString().split("T")[0] === selectedDate
      )
    : todo;
    // Calculate completion percentage for color-coding
  const calculateCompletionColor = (date) => {
    const todosOnDate = todo.filter(
      (item) => item.dueDate.toISOString().split('T')[0] === date
    );
    if (todosOnDate.length === 0) return null;
    const completed = todosOnDate.filter((t) => t.status === 'Completed').length;
    const percentage = (completed / todosOnDate.length) * 100;
    if (percentage < 50) return 'red';
    if (percentage < 90) return 'yellow';
    return 'green'; // Green for >=90% completion
  };

  // Generate markedDates for color-coding
  const markedDates = todo.reduce((acc, item) => {
    const dateString = item.dueDate.toISOString().split('T')[0];
    const backgroundColor = calculateCompletionColor(dateString);
    if (backgroundColor) {
      acc[dateString] = { backgroundColor };
    }
    return acc;
  }, {});
  return (
    <View style={styles.container}>
      {/* <Calendar
        onDayPress={(day) => setselectedDate(day.dateString)}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
           selectedDayBackgroundColor: '#00adf5',
          textSectionTitleColor: "#6B7280",
          // todayTextColor: "#FF2D55",
          dayTextColor: "#111827",
          // dayBackColor: "#ff0000ff",
          textDisabledColor: "#D1D5DB",
          monthTextColor: "#111827",
          textMonthFontWeight: "600",
          textDayFontWeight: "400",
        }}
        style={styles.calendar}
      /> */}
      <Calendar
        onDayPress={(day) => setselectedDate(day.dateString)}
        // Optional: Log day presses
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          selectedDayBackgroundColor: "#00adf5", // Kept for theme consistency, but not used
          textSectionTitleColor: "#6B7280",
          dayTextColor: "#111827",
          textDisabledColor: "#D1D5DB",
          monthTextColor: "#111827",
          textMonthFontWeight: "600",
          textDayFontWeight: "400",
        }}
        style={styles.calendar}
        markedDates={markedDates}
        dayComponent={CustomDay} // Use CustomDay for all days
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
            <Button onPress={add} title="add" />
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
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0, // Rectangular shape
    margin: 2,
  },
  selectedDay: {
    backgroundColor: "#00adf5", // Matches your theme's selectedDayBackgroundColor
    borderColor: "#00adf5",
  },
  todayDay: {
    borderColor: "#00adf5", // Blue border for today
  },
  disabledDay: {
    backgroundColor: "#f0f0f0",
  },
  dayText: {
    fontSize: 16,
    color: "#111827", // Matches your theme's dayTextColor
    fontWeight: "400", // Matches your theme's textDayFontWeight
  },
  selectedDayText: {
    color: "#ffffff", // White text for selected days
  },
  todayDayText: {
    color: "#00adf5", // Blue text for today
  },
  disabledDayText: {
    color: "#D1D5DB", // Matches your theme's textDisabledColor
  },
  todayText: {
    fontSize: 18.2,
    color: "#d14545ff",
    marginTop: 0,
  },
  dayBackColor: {
    // fontSize: 18.2,
    color: "#fdfdfdff",
    // marginTop: 0,
  },
});
