import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Pressable, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { calculateRowSum, calculateTotal } from '@/lib/calculations';

interface Row {
  id: string;
  name: string;
  x: string;
  y: string;
}

interface Headers {
  xLabel: string;
  yLabel: string;
  sumLabel: string;
}

interface SwipeableRowProps {
  row: Row;
  onUpdate: (id: string, field: keyof Row, value: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function SwipeableRowComponent({ row, onUpdate, onDelete, canDelete }: SwipeableRowProps) {
  const [isBeingSwiped, setIsBeingSwiped] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (gestureState: any) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (gestureState: any) => {
        if (canDelete && gestureState.dx < -20) {
          setIsBeingSwiped(true);
        }
      },
      onPanResponderRelease: (gestureState: any) => {
        const threshold = 80;
        if (gestureState.dx < -threshold && canDelete) {
          onDelete(row.id);
        }
        setIsBeingSwiped(false);
      },
    })
  ).current;

  return (
    <View
      style={[styles.dataRow, isBeingSwiped && styles.swipedRow]}
      {...panResponder.panHandlers}
    >
      <TextInput
        style={[styles.cell, styles.nameCell, styles.input]}
        placeholder="Enter name"
        placeholderTextColor="#999"
        value={row.name}
        onChangeText={(text) => onUpdate(row.id, 'name', text)}
        scrollEnabled={false}
      />
      <TextInput
        style={[styles.cell, styles.numberCell, styles.input]}
        placeholder="0"
        placeholderTextColor="#999"
        inputMode="decimal"
        value={row.x}
        onChangeText={(text) => onUpdate(row.id, 'x', text)}
        scrollEnabled={false}
      />
      <TextInput
        style={[styles.cell, styles.numberCell, styles.input]}
        placeholder="0"
        placeholderTextColor="#999"
        inputMode="decimal"
        value={row.y}
        onChangeText={(text) => onUpdate(row.id, 'y', text)}
        scrollEnabled={false}
      />
      <View style={[styles.cell, styles.sumCell]}>
        <Text style={styles.sumText}>
          {calculateRowSum(row.x, row.y).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [rows, setRows] = useState<Row[]>([
    { id: '1', name: '', x: '', y: '' },
    { id: '2', name: '', x: '', y: '' },
    { id: '3', name: '', x: '', y: '' },
  ]);

  const [headers, setHeaders] = useState<Headers>({
    xLabel: 'X',
    yLabel: 'Y',
    sumLabel: 'Result',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRows = await AsyncStorage.getItem('rows');
        const savedHeaders = await AsyncStorage.getItem('headers');

        if (savedRows) setRows(JSON.parse(savedRows));
        if (savedHeaders) setHeaders(JSON.parse(savedHeaders));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save rows whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    const saveRows = async () => {
      try {
        await AsyncStorage.setItem('rows', JSON.stringify(rows));
      } catch (error) {
        console.error('Error saving rows:', error);
      }
    };

    saveRows();
  }, [rows, isLoaded]);

  // Save headers whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    const saveHeaders = async () => {
      try {
        await AsyncStorage.setItem('headers', JSON.stringify(headers));
      } catch (error) {
        console.error('Error saving headers:', error);
      }
    };

    saveHeaders();
  }, [headers, isLoaded]);

  const updateRow = (id: string, field: keyof Row, value: string) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const updateHeader = (field: keyof Headers, value: string) => {
    setHeaders(prev => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    const newId = Math.max(...rows.map(r => parseInt(r.id)), 0) + 1;
    setRows([...rows, { id: newId.toString(), name: '', x: '', y: '' }]);
  };

  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.nameCell]}>
              <Text style={styles.headerText}>Name</Text>
            </View>
            <TextInput
              style={[styles.cell, styles.numberCell, styles.headerInput]}
              value={headers.xLabel}
              onChangeText={(text) => updateHeader('xLabel', text)}
              placeholder="X"
              placeholderTextColor="#666"
            />
            <TextInput
              style={[styles.cell, styles.numberCell, styles.headerInput]}
              value={headers.yLabel}
              onChangeText={(text) => updateHeader('yLabel', text)}
              placeholder="Y"
              placeholderTextColor="#666"
            />
            <View style={[styles.cell, styles.sumCell]}>
              <TextInput
                style={[styles.headerInput, styles.sumHeaderInput]}
                value={headers.sumLabel}
                onChangeText={(text) => updateHeader('sumLabel', text)}
                placeholder="Result"
                placeholderTextColor="#666"
              />
              <Text style={styles.sumHeaderSuffix}>(sum)</Text>
            </View>
          </View>

          {/* Data Rows with Swipe to Delete */}
          {rows.map((row) => (
            <SwipeableRowComponent
              key={row.id}
              row={row}
              onUpdate={updateRow}
              onDelete={deleteRow}
              canDelete={rows.length > 1}
            />
          ))}

          {/* Total Row */}
          <View style={[styles.dataRow, styles.totalRow]}>
            <View style={[styles.cell, styles.nameCell]} />
            <View style={[styles.cell, styles.numberCell]} />
            <View style={[styles.cell, styles.numberCell]} />
            <View style={[styles.cell, styles.sumCell]}>
              <Text style={styles.totalText}>
                {calculateTotal(rows).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Row Button */}
      <Pressable style={styles.addButton} onPress={addRow}>
        <Text style={styles.addButtonText}>+ Add Row</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#999',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  swipedRow: {
    backgroundColor: '#ffebee',
  },
  totalRow: {
    backgroundColor: '#f9f9f9',
    borderTopWidth: 2,
    borderTopColor: '#999',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#fff',
  },
  nameCell: {
    flex: 1,
  },
  numberCell: {
    width: 40,
  },
  sumCell: {
    width: 80,
    borderRightWidth: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 6,
  },
  input: {
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f5f5f5',
  },
  headerInput: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f0f0f0',
    padding: 8,
    textAlign: 'center',
  },
  sumHeaderInput: {
    width: '100%',
    height: 30,
    marginBottom: 2,
  },
  sumHeaderSuffix: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  sumText: {
    fontSize: 14,
    color: '#666',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
