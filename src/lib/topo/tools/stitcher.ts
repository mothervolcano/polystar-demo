// import { Point } from 'paper';
import { TopoPoint } from "../drawing/paperjs";

import HyperPoint from "../core/hyperPoint";

import { convertToHyperPoint, convertToPoint, convertToSegment } from "../utils/converters";
import { BooleanLike, HyperPoint as HyperPointType  } from "../topo";

export function measure(hpt1: any, hpt2: any, ratio: number = 1) {
	const A = convertToPoint(hpt1);
	const B = convertToPoint(hpt2);

	return A.getDistance(B) * ratio;
}

export function merge(hpt1: any, hpt2: any) {
	const hpt = new HyperPoint(hpt1.point, hpt1.handleIn, hpt2.handleOut);

	hpt.position = hpt1.position;
	hpt.setTangent(hpt1.getTangent());
	hpt.setNormal(hpt1.getNormal());
	hpt.spin = hpt1.spin;
	hpt.polarity = hpt1.polarity;

	return hpt;
}

export function pull(hpt: HyperPointType, length: number) {
	hpt.handleIn.length = length;
	hpt.handleOut.length = length;
}

export function breakOut(hpt: HyperPointType, angle: number) {
	hpt.handleOut.angle += angle;
}

export function breakIn(hpt: HyperPointType, angle: number) {
	hpt.handleIn.angle += angle;
}

export function iron(hpt1: HyperPointType, hpt2: any) {
	hpt1.handleOut = new TopoPoint({x:0, y:0});
	hpt2.handleIn = new TopoPoint({x:0, y:0});
}

export function retract(hpt: HyperPointType) {
	hpt.handleIn.length = 0;
	hpt.handleOut.length = 0;
}

export function scaleHandles(
	hpt: HyperPoint,
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

	const _P = A.add(new TopoPoint((B.x - A.x) / 2, (B.y - A.y) / 2));

	const P = convertToHyperPoint(_P);

	P.setTangent(new TopoPoint((B.x - _P.x) / 3, (B.y - _P.y) / 3)); 
	P.getTangent().normalize();
	P.setNormal(P.getTangent().rotate(-90, P.point));
	P.getNormal().normalize();

	P.handleIn = new TopoPoint((B.x - _P.x) / 3, (B.y - _P.y) / 3);
	P.handleOut = new TopoPoint((A.x - _P.x) / 3, (A.y - _P.y) / 3);

	return P;
}
