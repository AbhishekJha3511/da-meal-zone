import { addMeal } from '@/storage/meals';
import { colors, globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddMealScreen() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleAddMeal = async () => {
    if (!name.trim() || !calories || !protein || !carbs || !fat) {
      Alert.alert('Missing Fields', 'Please fill in all fields before adding a meal.');
      return;
    }

    const parsedCalories = parseFloat(calories);
    const parsedProtein = parseFloat(protein);
    const parsedCarbs = parseFloat(carbs);
    const parsedFat = parseFloat(fat);

    if (
      isNaN(parsedCalories) ||
      isNaN(parsedProtein) ||
      isNaN(parsedCarbs) ||
      isNaN(parsedFat)
    ) {
      Alert.alert('Invalid Input', 'Macro values must be valid numbers.');
      return;
    }

    setLoading(true);
    try {
      await addMeal({
        name: name.trim(),
        calories: parsedCalories,
        protein: parsedProtein,
        carbs: parsedCarbs,
        fat: parsedFat,
      });

      resetForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Meal Added!', `"${name.trim()}" has been logged successfully.`, [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={globalStyles.container} keyboardShouldPersistTaps='handled'>
        <Text style={globalStyles.title}>Add Meal</Text>

        <TextInput
          style={styles.input}
          placeholder='Meal name'
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          returnKeyType='next'
        />

        <TextInput
          style={styles.input}
          placeholder='Calories (kcal)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={calories}
          onChangeText={setCalories}
          returnKeyType='next'
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder='Protein (g)'
            placeholderTextColor={colors.textSecondary}
            keyboardType='numeric'
            value={protein}
            onChangeText={setProtein}
            returnKeyType='next'
          />
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder='Carbs (g)'
            placeholderTextColor={colors.textSecondary}
            keyboardType='numeric'
            value={carbs}
            onChangeText={setCarbs}
            returnKeyType='next'
          />
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder='Fat (g)'
            placeholderTextColor={colors.textSecondary}
            keyboardType='numeric'
            value={fat}
            onChangeText={setFat}
            returnKeyType='done'
            onSubmitEditing={handleAddMeal}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddMeal}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving…' : 'Add Meal'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});