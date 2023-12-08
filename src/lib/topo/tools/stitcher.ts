// import { Point } from 'paper';
import { Point } from "../drawing/paperjs";

import HyperPoint from "../core/hyperPoint";

import { convertToHyperPoint, convertToPoint, convertToSegment } from "../utils/converters";
import { BooleanLike, IHyperPoint } from "../types";

export function measure(hpt1: any, hpt2: any, ratio: number = 1) {
	const A = convertToPoint(hpt1);
	const B = convertToPoint(hpt2);

	return A.getDistance(B) * ratio;
}

export function merge(hpt1: any, hpt2: any) {
	const hpt = new HyperPoint(hpt1.point, hpt1.handleIn, hpt2.handleOut);

	hpt.position = hpt1.position;
	hpt.tangent = hpt1.tangent;
	hpt.normal = hpt1.normal;
	hpt.spin = hpt1.spin;
	hpt.polarity = hpt1.polarity;

	return hpt;
}

export function pull(hpt: IHyperPoint, length: number) {
	hpt.handleIn.length = length;
	hpt.handleOut.length = length;
}

export function breakOut(hpt: any, angle: number) {
	hpt.handleOut.angle += angle;
}

export function breakIn(hpt: any, angle: number) {
	hpt.handleIn.angle += angle;
}

export function iron(hpt1: any, hpt2: any) {
	hpt1.handleOut = null;
	hpt2.handleIn = null;
}

export function retract(hpt: any) {
	hpt.handleIn.length = 0;
	hpt.handleOut.length = 0;
}

export function scaleHandles(
	hpt: IHyperPoint,
	scale: number,
	scaleIn: BooleanLike = true,
	scaleOut: BooleanLike = true,
) {
	if (scaleIn) {
		if (scale >= 0 && scale <= 1 && hpt.handleIn) {
			hpt.handleIn.length *= scale;
		} else if (scale > 1) {
			hpt.handleIn.length *= scale;
		}
	}

	if (scaleOut) {
		if (scale >= 0 && scale <= 1 && hpt.handleOut) {
			hpt.handleOut.length *= scale;
		} else if (scale > 1) {
			hpt.handleOut.length *= scale;
		}
	}

	return hpt;
}

export function ortoAlign(hpt: any, along: string) {
	if (along === "HOR") {
		hpt.handleIn.angle = 180;
		hpt.handleOut.angle = 0;

		return hpt;
	}

	if (along === "VER") {
		hpt.handleIn.angle = -90;
		hpt.handleOut.angle = 90;

		return hpt;
	}
}

export function mirror(hpt: any, angle: number) {
	hpt.handleIn.angle = angle - (hpt.handleOut.angle - angle);
}

export function budge(hpt1: any, hpt2: any, angle: number) {
	hpt1.handleOut.angle += angle;
	hpt2.handleIn.angle -= angle;
}

// TODO: deprecated. use clap instead;
export function bounce(hpt: any) {
	hpt.handleOut = hpt.handleIn;

	return hpt;
}

export function clap(hpt: any) {
	hpt.handleOut = hpt.handleIn;

	return hpt;
}

export function tie(hpt1: any, hpt2: any, ratio: number = 1) {
	hpt1.handleIn.length = hpt2.handleIn.length * ratio;
	hpt1.handleOut.length = hpt2.handleOut.length * ratio;
}

export function lock(hpt1: any, hpt2: any, ratio: number = 1) {
	hpt1.handleOut.length = hpt2.handleIn.length * ratio;
}

export function mid(hpt1: any, hpt2: any) {
	const A = convertToPoint(hpt1);
	const B = convertToPoint(hpt2);

	const _P = A.add(new Point((B.x - A.x) / 2, (B.y - A.y) / 2));

	const P = convertToHyperPoint(_P);

	P.tangent = new Point((B.x - _P.x) / 3, (B.y - _P.y) / 3);
	P.tangent.normalize();
	P.normal = P.tangent.rotate(-90, P.point);
	P.normal.normalize();

	P.handleIn = new Point((B.x - _P.x) / 3, (B.y - _P.y) / 3);
	P.handleOut = new Point((A.x - _P.x) / 3, (A.y - _P.y) / 3);

	return P;
}
