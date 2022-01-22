import { parseService } from "../../services/parse-service";
import { calculusService } from "../../services/calculus-service";
import { app } from "../../../app";
import request from "supertest";
import { stringExtensions } from "../../utils/string-extensions";

it("calculus handler returns 400 when query is empty", async () => {

    await request(app)
        .get("/calculus")
        .send()
        .expect(400);
});

it("calculus handler returns 400 when query has invalid query", async () => {

    await request(app)
        .get("/calculus?query= ")
        .send()
        .expect(400);

    await request(app)
        .get("/calculus?query=3+5)")
        .send()
        .expect(400);

    await request(app)
        .get("/calculus?query=6%10")
        .send()
        .expect(400);
});

test("calculus handler returns 200 when query is valid", async () => {

    await request(app)
        .get(`/calculus?query=${stringExtensions.unicodeTob64("3+6/2-1+3*3")}`)
        .send()
        .expect(200);
});