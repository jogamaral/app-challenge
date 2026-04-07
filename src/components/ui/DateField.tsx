import { inputDate, toIsoDate } from "@/lib/format";
import { colors, radii, spacing } from "@/theme/tokens";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FormField } from "./FormField";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
};

export function DateField({ label, value, onChange, help }: Props) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => new Date(`${value}T12:00:00`), [value]);

  if (Platform.OS === "web") {
    return <FormField label={label} value={value} onChangeText={onChange} help={help ?? "Use o formato AAAA-MM-DD"} />;
  }

  const handleChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
    }

    if (event.type === "dismissed" || !nextDate) {
      return;
    }

    onChange(toIsoDate(nextDate));
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setOpen((current) => !current)} style={styles.input}>
        <Text style={styles.value}>{inputDate(value)}</Text>
      </Pressable>
      {help ? <Text style={styles.help}>{help}</Text> : null}
      {open ? (
        <View style={styles.pickerWrap}>
          <DateTimePicker value={selectedDate} mode="date" display={Platform.OS === "ios" ? "inline" : "default"} onChange={handleChange} maximumDate={new Date("2100-12-31T12:00:00")} />
          {Platform.OS === "ios" ? (
            <Pressable onPress={() => setOpen(false)} style={styles.doneButton}>
              <Text style={styles.doneText}>Concluir</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
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
    justifyContent: "center",
  },
  value: {
    color: colors.text,
    fontSize: 15,
  },
  help: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  pickerWrap: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  doneText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
