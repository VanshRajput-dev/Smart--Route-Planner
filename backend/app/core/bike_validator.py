VALID_RANGES = {
    "engine_cc": (50, 1300),
    "power_bhp": (3, 220),
    "torque_nm": (5, 200),
    "kerb_weight_kg": (90, 300),
    "mileage_kmpl": (10, 90),
}

REQUIRED_FIELDS = [
    "engine_cc",
    "kerb_weight_kg",
]

OPTIONAL_POWER_FIELDS = [
    "power_bhp",
    "torque_nm",
]


def _is_number(value):
    return isinstance(value, (int, float))


def validate_field(value, field_name):
    if value is None:
        return "missing"

    if not _is_number(value):
        return "invalid_type"

    min_val, max_val = VALID_RANGES[field_name]

    if value < min_val or value > max_val:
        return "out_of_range"

    return "valid"


def validate_bike(bike):
    field_status = {}

    for field in VALID_RANGES:
        field_status[field] = validate_field(
            bike.get(field),
            field
        )

    has_required = all(
        field_status[field] == "valid"
        for field in REQUIRED_FIELDS
    )

    has_power = any(
        field_status[field] == "valid"
        for field in OPTIONAL_POWER_FIELDS
    )

    is_usable = has_required and has_power

    return {
        "is_usable": is_usable,
        "field_status": field_status,
        "has_required": has_required,
        "has_power": has_power,
    }
