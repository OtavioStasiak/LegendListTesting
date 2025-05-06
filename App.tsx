import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Switch } from "react-native";
import { LegendList } from "@legendapp/list";

interface MessageItem {
  id: string;
  title: string;
  body: string;
}

const generateMockData = (count: number): MessageItem[] => {
  return Array(count)
    .fill(0)
    .map((_, index) => ({
      id: `item-${index + 1}`,
      title: `User ${index + 1}`,
      body: "LastMessage.",
    }));
};

const ALL_MOCK_DATA: MessageItem[] = generateMockData(100);

const ITEMS_PER_PAGE = 10;

const keyExtractor = (item: MessageItem): string => item.id;

interface ItemProps {
  item: MessageItem;
  changeDisplay: boolean;
}

const Item: React.FC<ItemProps> = ({ item, changeDisplay }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.title, { fontSize: 20 }]}>{item.title}</Text>
      {!changeDisplay ? (
        <Text style={[styles.message, { fontSize: 16 }]}>{item.body}</Text>
      ) : null}
    </View>
  );
};

const App = () => {
  const [data, setData] = useState<MessageItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  //  change to flatlist and the layout will change when the changeDisplay changes.
  const [changeDisplay, setChangeDisplay] = useState<boolean>(false);

  const loadMockData = (
    pageNumber: number = 1,
    isRefreshing: boolean = false
  ) => {
    setLoading(true);

    setTimeout(() => {
      const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = ALL_MOCK_DATA.slice(startIndex, endIndex);

      if (isRefreshing) {
        setData(newItems);
      } else {
        setData((prevData) => [...prevData, ...newItems]);
      }

      setPage(pageNumber);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadMockData();

    return () => {
      setData([]);
      setPage(1);
      setLoading(false);
    };
  }, []);

  const handleEndReached = () => {
    if (!loading) {
      loadMockData(page + 1);
    }
  };

  const renderItem = ({ item }: { item: MessageItem }) => (
    <Item item={item} changeDisplay={changeDisplay} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.changeDisplayContainer}>
        <Text style={styles.title}>Change display:</Text>
        <Switch
          value={changeDisplay}
          onValueChange={(value) => setChangeDisplay(value)}
        />
      </View>

      <LegendList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        recycleItems={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  changeDisplayContainer: {
    marginTop: 80,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#c8c8c8",
  },
});

export default App;
