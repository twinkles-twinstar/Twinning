namespace TwinStar.Script {

	// ------------------------------------------------

	export function is_boolean(
		value: unknown,
	): value is boolean {
		return typeof value === 'boolean';
	}

	export function is_bigint(
		value: unknown,
	): value is bigint {
		return typeof value === 'bigint';
	}

	export function is_number(
		value: unknown,
	): value is number {
		return typeof value === 'number';
	}

	export function is_string(
		value: unknown,
	): value is string {
		return typeof value === 'string';
	}

	export function is_object(
		value: unknown,
	): value is object {
		return typeof value === 'object';
	}

	export function is_object_of_object(
		value: unknown,
	): value is Record<any, any> {
		return is_object(value) && value.constructor.name === 'Object';
	}

	export function is_object_of_array(
		value: unknown,
	): value is Array<any> {
		return is_object(value) && value.constructor.name === 'Array';
	}

	// ------------------------------------------------

	export function is_or<Value, Except extends Value, Fallback>(
		value: Value,
		expect: Except,
		fallback: Fallback,
	): Except | Fallback {
		return value === expect ? value as Except : fallback;
	}

	export function not_or<Value, Except extends Value, Fallback>(
		value: Value,
		expect: Except,
		fallback: Fallback,
	): Exclude<Value, Except> | Fallback {
		return value !== expect ? value as Exclude<Value, Except> : fallback;
	}

	// ------------------------------------------------

	export function is_undefined_or<Value, Fallback>(
		value: Value | undefined,
		fallback: Fallback,
	): undefined | Fallback {
		return is_or(value, undefined, fallback);
	}

	export function not_undefined_or<Value, Fallback>(
		value: Value | undefined,
		fallback: Fallback,
	): Value | Fallback {
		return not_or(value, undefined, fallback);
	}

	export function is_null_or<Value, Fallback>(
		value: Value | null,
		fallback: Fallback,
	): null | Fallback {
		return is_or(value, null, fallback);
	}

	export function not_null_or<Value, Fallback>(
		value: Value | null,
		fallback: Fallback,
	): Value | Fallback {
		return not_or(value, null, fallback);
	}

	// ------------------------------------------------

	export function record_from_array<Element extends any, Key extends string, Value extends any>(
		source: Array<Element>,
		mapper: (index: number, element: Element) => [Key, Value],
	): Record<Key, Value> {
		let destination: Record<Key, Value> = {} as any;
		for (let index in source) {
			let [key, value] = mapper(Number(index), source[index]);
			destination[key] = value;
		}
		return destination;
	}

	export function record_to_array<Key extends string | number | symbol, Value extends any, Element extends any>(
		source: Record<Key, Value>,
		mapper: (key: Key, value: Value) => Element,
	): Array<Element> {
		let destination: Array<Element> = [];
		for (let key in source) {
			destination.push(mapper(key, source[key]));
		}
		return destination;
	}

	export function record_transform<Key extends string | number | symbol, Value extends any, NewKey extends string | number | symbol, NewValue extends any>(
		source: Record<Key, Value>,
		mapper: (key: Key, value: Value) => [NewKey, NewValue],
	): Record<NewKey, NewValue> {
		let destination: Record<NewKey, NewValue> = {} as any;
		for (let key in source) {
			let [new_key, new_value] = mapper(key, source[key]);
			destination[new_key] = new_value;
		}
		return destination;
	}

	// ------------------------------------------------

	export function object_clear_undefined<Target extends Object>(
		target: Target,
	): Target {
		for (let key in target) {
			let value = target[key];
			if (value === undefined) {
				delete target[key];
			}
		}
		return target;
	}

	// ------------------------------------------------

	export function make_prefix_padded_string(
		source: any,
		prefix: string,
		maximum_length: number,
	): string {
		let source_string = `${source}`;
		return `${prefix.repeat(Math.max(0, maximum_length - source_string.length) / prefix.length)}${source_string}`;
	}

	// ------------------------------------------------

	export function make_confirmation_boolean_string(
		value: boolean,
	): string {
		return !value ? 'n' : 'y';
	}

	export function parse_confirmation_boolean_string(
		string: string,
	): boolean {
		if (string === 'n') {
			return false;
		}
		if (string === 'y') {
			return true;
		}
		assert_fail(`invalid confirmation boolean string`);
	}

	export function make_integer_string(
		value: bigint,
	): string {
		return `${value > 0n ? '+' : ''}${value}`;
	}

	export function make_number_string(
		value: number,
	): string {
		return `${value > 0.0 ? '+' : ''}${value}${Number.isInteger(value) ? '.0' : ''}`;
	}

	export function make_size_string(
		value: bigint,
	): string {
		assert_test(value >= 0n);
		let value_part = Number(value);
		let unit_level = 0;
		if (value_part >= 1024.0) {
			value_part /= 1024.0;
			unit_level += 1;
		}
		if (value_part >= 1024.0) {
			value_part /= 1024.0;
			unit_level += 1;
		}
		if (value_part >= 1024.0) {
			value_part /= 1024.0;
			unit_level += 1;
		}
		return `${value_part.toFixed(1)}${['b', 'k', 'm', 'g'][unit_level]}`;
	}

	export function parse_size_string(
		string: string,
	): bigint {
		const k_unit_map = {
			b: 1,
			k: 1024,
			m: 1024 * 1024,
			g: 1024 * 1024 * 1024,
		};
		return BigInt((Number.parseFloat(string.slice(0, -1)) * k_unit_map[string.slice(-1) as 'b' | 'k' | 'm' | 'g']).toFixed(0));
	}

	// ------------------------------------------------

	export function make_date_simple_string(
		value: Date,
	): string {
		let p = (source: number, maximum_length: number) => (make_prefix_padded_string(source, '0', maximum_length));
		return `${p(value.getFullYear() % 100, 2)}-${p(value.getMonth() + 1, 2)}-${p(value.getDate(), 2)}.${p(value.getHours(), 2)}-${p(value.getMinutes(), 2)}-${p(value.getSeconds(), 2)}.${p(value.getMilliseconds(), 3)}`;
	}

	// ------------------------------------------------

	export function number_is_equal(
		x: number,
		y: number,
		tolerance = Number.EPSILON,
	): boolean {
		return Math.abs(x - y) < tolerance;
	}

	export function integer_from_byte(
		byte_array: ArrayBuffer,
		endian: 'little' | 'big' | 'current' = 'current',
	): bigint {
		let integer_array = new Uint8Array(byte_array);
		let result = 0n;
		if (endian === 'current') {
			endian = Kernel.Miscellaneous.g_context.query_byte_stream_use_big_endian().value ? 'big' : 'little';
		}
		if (endian === 'little') {
			for (let index in integer_array) {
				result = result | BigInt(integer_array[index]) << BigInt(8 * Number(index));
			}
		}
		if (endian === 'big') {
			for (let index in integer_array) {
				result = result << 8n | BigInt(integer_array[index]);
			}
		}
		return result;
	}

	// ------------------------------------------------

	export function unquote_string(
		source: string,
	): string {
		let destination = source;
		if (false) {
		}
		else if (destination.length >= 2 && destination.startsWith(`'`) && destination.endsWith(`'`)) {
			destination = destination.slice(1, -1);
		}
		else if (destination.length >= 2 && destination.startsWith(`"`) && destination.endsWith(`"`)) {
			destination = destination.slice(1, -1);
		}
		return destination;
	}

	// ------------------------------------------------

	export function normalize_string_line_feed(
		source: string,
	): string {
		return source.replaceAll('\r\n', '\n');
	}

	export function split_string_by_line_feed(
		source: string,
		ignore_last_if_empry: boolean = true,
	): Array<string> {
		let destination = source.split('\n');
		if (ignore_last_if_empry) {
			if (destination.length > 0 && destination[destination.length - 1].length === 0) {
				destination.pop();
			}
		}
		return destination;
	}

	// ------------------------------------------------

	export function split_error_stack(
		string: undefined | string,
	): Array<string> {
		let list: Array<string>;
		if (string === undefined) {
			list = [`@ ?`];
		}
		else {
			list = string.split('\n').slice(0, -1).map((e) => {
				let result: string;
				let regexp_result = /    at (.*) \((.*)\)/.exec(e);
				if (regexp_result !== null) {
					result = `@ ${regexp_result[2] === 'native' ? ('<native>:?') : (regexp_result[2])} ${regexp_result[1]}`;
				}
				else {
					result = '@ ?';
				}
				return result;
			});
		}
		return list;
	}

	export function parse_error_message(
		error: any,
	): [string, Array<string>] {
		let title: string = '';
		let description: Array<string> = [];
		if (error instanceof Error) {
			if (error.name === 'NativeError') {
				title = `${error.name}`;
				description.push(...error.message.split('\n'));
			}
			else {
				title = `${error.name}: ${error.message}`;
			}
			description.push(...split_error_stack(error.stack));
		}
		else {
			title = `${error}`;
		}
		return [title, description];
	}

	// ------------------------------------------------

	export function string_data_maybe_utf16(
		source: ArrayBuffer,
	): boolean {
		return source.byteLength >= 2 && [0xFFFE, 0xFEFF].includes(new DataView(source).getUint16(0, true));
	}

	// ------------------------------------------------

}