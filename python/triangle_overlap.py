def sign(p1, p2, p3):
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])

def pointInTriangle(p, v1, v2, v3):
    # consider using barycentric coordinates instead of half-plane method
    d1 = sign(p, v1, v2)
    d2 = sign(p, v2, v3)
    d3 = sign(p, v3, v1)
    has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0)

    return not (has_neg and has_pos)

# valid triangle if non zero area
def isTriangleDegenerate(a, b, c, eps=0):
    return abs(a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) <= eps

# return point intersection of two line segments
def intersect(p1, p2, p3, p4):
    x1,y1 = p1
    x2,y2 = p2
    x3,y3 = p3
    x4,y4 = p4
    denom = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1)
    if denom == 0: # parallel
        return None
    ua = ((x4-x3) * (y1-y3) - (y4-y3) * (x1-x3)) / denom
    if ua < 0 or ua > 1: # out of range
        return None
    ub = ((x2-x1) * (y1-y3) - (y2-y1) * (x1-x3)) / denom
    if ub < 0 or ub > 1: # out of range
        return None
    x = x1 + ua * (x2-x1)
    y = y1 + ua * (y2-y1)
    return (x, y)

def weilerAtherton(a1, a2, a3, b1, b2, b3):
    # test for triangle degeneracy
    if isTriangleDegenerate(a1, a2, a3):
        # print("first triangle is degenerate")
        return None
    if isTriangleDegenerate(b1, b2, b3):
        # print("second triangle is degenerate") 
        return None

    # flip triangle order if necessary
    if sign(a1, a2, a3) < 0:
        a1, a3 = a3, a1
    if sign(b1, b2, b3) < 0:
        b1, b3 = b3, b1


    segmentsA = ((a1, a2), (a2, a3), (a3, a1))
    segmentsB = ((b1, b2), (b2, b3), (b3, b1))

    accA = [a1, a2, a3]
    accB = [b1, b2, b3]
    intersections = []
    entryPoint = None

    for segA in segmentsA:
        for segB in segmentsB:
            intersection = intersect(segA[0], segA[1], segB[0], segB[1])
            if intersection:
                if intersection in segA or intersection in segB:
                    # vertex-on-edge or vertex-on-vertex or edge-on-edge
                    # print(f"touching vertex {intersection}")
                    continue               
                else:
                    intersections.append(intersection)

                    # insert intersection point into the polygon point lists
                    idA = len(accA) if accA.index(segA[1])==0 else accA.index(segA[1])
                    idB = len(accB) if accB.index(segB[1])==0 else accB.index(segB[1])
                    accA.insert(idA, intersection)
                    accB.insert(idB, intersection)
                    
                    if not entryPoint:
                        # TODO: make this into a function parameter
                        eps = 0.01
                        isEntering = pointInTriangle((intersection[0] + eps * (segB[1][0] - segB[0][0]), intersection[1] + eps * (segB[1][1] - segB[0][1])), a1, a2, a3)
                        if (isEntering):
                            entryPoint = intersection

    if not entryPoint:
        # check for complete containment, we already know there are no intersection, so one point test is enough
        if pointInTriangle(a1, b1, b2, b3):
            # print("A in B")
            return accA
        if pointInTriangle(b1, a1, a2, a3):
            # print("B in A")
            return accB
    else:
        # do the weiler-atherton magic shit here
        # init the accumulator
        acc = [entryPoint]
        traversingA = False
        while(True):      
            traversedList = accA if traversingA else accB

            # next point index
            nextIdx = traversedList.index(acc[-1]) + 1
            if nextIdx == len(traversedList):
                # loop the list 
                nextIdx = 0

            # next point of the result
            nextElm = accA[nextIdx] if traversingA else accB[nextIdx]
            if nextElm in intersections:
                # loop complete, we can end
                if nextElm == entryPoint:
                    break
                # this is intersected point - we are switching lists
                traversingA = not traversingA
            acc.append(nextElm)
        
        return acc

if __name__ == "__main__":
    # print("Hello Work")

    # same triangle
    # inter = weilerAtherton(
    #     (0, 0), (2, 0), (2, 2), 
    #     (0, 0), (2, 0), (2, 2))
    # print(inter)

    # B in A
    # inter = weilerAtherton(
    #     (0, 0), (2, 0), (2, 2), 
    #     (1, 0), (2, 0), (2, 1))
    # print(inter)

    # edge touching edge
    # weilerAtherton(
    #     (0, 0), (2, 0), (2, 2), 
    #     (1, 0), (3, 0), (2, -2))

    # vertex touching vertex
    # weilerAtherton(
    #     (0, 0), (2, 0), (2, 2), 
    #     (2, 0), (2, -2), (4, 0))

    # vertex touching edge
    inter = weilerAtherton(
        (0, 0), (2, 0), (2, 2), 
        (1, 1), (2, -1), (3, 1))        
    print(inter)

    # reversed second triangle
    inter = weilerAtherton(
        (0, 0), (2, 0), (2, 2), 
        (3, 1), (2, -1), (1, 1))        
    print(inter)

    # one triangle is degenerate
    # weilerAtherton(
    #     (0, 0), (2, 0), (1, 0), 
    #     (1, 1), (2, -1), (3, 1))

    # non overlapping
    # inter = weilerAtherton(
    #     (0,  0), (2,  0), (2,  2), 
    #     (0, -1), (2, -1), (2, -3))
    # print(inter)

