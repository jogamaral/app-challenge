import { SelectOption } from "@/data/vehicleCatalog";
import { colors, radii, shadows, spacing } from "@/theme/tokens";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  help?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
};

export function SearchableSelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  help,
  disabled,
  searchPlaceholder = "Busque uma opção",
  emptyText = "Nenhuma opção encontrada.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const displayValue = selectedOption?.label || value || placeholder;
  const filteredOptions = useMemo(() => {
    if (!deferredQuery) {
      return options;
    }

    return options.filter((option) => option.label.toLocaleLowerCase().includes(deferredQuery));
  }, [deferredQuery, options]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable disabled={disabled} onPress={() => setOpen(true)} style={({ pressed }) => [styles.input, disabled && styles.inputDisabled, pressed && !disabled && styles.inputPressed]}>
        <Text numberOfLines={1} style={[styles.value, !selectedOption && !value && styles.placeholder]}>
          {displayValue}
        </Text>
        <Text style={[styles.chevron, disabled && styles.chevronDisabled]}>v</Text>
      </Pressable>
      {help ? <Text style={styles.help}>{help}</Text> : null}
      <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.headerCopy}>
                <Text style={styles.modalTitle}>{label}</Text>
                <Text style={styles.modalSubtitle}>Selecione uma opção da lista</Text>
              </View>
              <Pressable onPress={() => setOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Fechar</Text>
              </Pressable>
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              value={query}
            />
            <FlatList
              data={filteredOptions}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = item.value === value;

                return (
                  <Pressable onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }} style={[styles.option, selected && styles.optionSelected]}>
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item.label}</Text>
                  </Pressable>
                );
              }}
              style={styles.list}
              ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.8,
  },
  inputPressed: {
    opacity: 0.92,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  placeholder: {
    color: colors.textMuted,
  },
  chevron: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  chevronDisabled: {
    color: colors.textMuted,
  },
  help: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 39, 71, 0.42)",
  },
  modalCard: {
    maxHeight: "80%",
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
    ...(Platform.OS === "web" ? { width: "100%", maxWidth: 520, alignSelf: "center" } : {}),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    paddingVertical: spacing.xs,
  },
  closeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  searchInput: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    minHeight: 180,
  },
  option: {
    minHeight: 48,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: "#FFF0E6",
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: colors.primaryDark,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
});
